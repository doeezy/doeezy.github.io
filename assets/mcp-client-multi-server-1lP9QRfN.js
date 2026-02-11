const n=`---
title: "[MCP] Mcp Client ↔ 멀티 Mcp Server 연동"
menu: ai-llm
date: 2026-02-09
tags:
  - MCP Server
  - MCP Client
  - LLM
  - AI Agent
---

MCP Client는 여러 MCP 서버의 tool을 통합하여 LLM에 노출하고, LLM이 선택한 tool을 실제 MCP 서버로 라우팅·실행하는 오케스트레이터 역할을 수행

## 🚀 플로우

1. 여러 MCP 서버에 연결하여 세션 초기화
    - 이번 PoC에서는 로컬 MCP 서버와 SerpApi MCP 서버 사용
2. 각 MCP 서버로부터 tool 목록 조회 및 서버가 제공하는 tool metadata 수집
3. 각 MCP 서버의 tool 목록을 병합
    - 네임스페이스(prefix)로 tool name 중복 방지
4. 사용자 질문과 함께 병합된 tool 목록을 LLM에 전달
5. LLM이 tool을 선택한 경우(tool_calls) 해당 tool을 라우팅하여 실행함
    - tool name(prefix)을 기준으로 대상 MCP 서버 세션 선택
    - 실제 MCP tool name과 arguments로 call_tool() 수행

\`\`\`python
# CASE 2: 멀티 Mcp 사용할 경우
# OpenAI 요청을 위한 Tools + 라우팅맵 생성
def build_openai_tools_and_routes(
    server_key: str,
    mcp_tools: List[mcp_types.Tool],
) -> Tuple[List[Dict[str, Any]], Dict[str, Dict[str, str]]]:
    """
    server_key를 prefix로 붙여서 tool name 충돌 방지:
      - OpenAI tool name: "{server_key}.{tool_name}"
      - route_map: namespaced_name -> {"server_key": ..., "tool_name": ...}
    """
    tools_out: List[Dict[str, Any]] = []
    route_map: Dict[str, Dict[str, str]] = {}

    for t in mcp_tools:
        namespaced = f"{server_key}-{t.name}"
        tools_out.append(
            {
                "type": "function",
                "function": {
                    "name": namespaced,
                    "description": t.description or "",
                    "parameters": t.inputSchema or {"type": "object", "properties": {}},
                },
            }
        )
        route_map[namespaced] = {"server_key": server_key, "tool_name": t.name}

    return tools_out, route_map
    
 async def run_agent(user_text: str) -> str:
    load_dotenv()

    llm_base = os.environ["LLM_BASE_URL"]
    llm_key = os.environ["LLM_API_KEY"]
    llm_model = os.environ.get("LLM_MODEL", "gpt-4.1-mini")
    serapi_key = os.environ.get("SERPAPI_KEY", "")
    _base_url = os.environ.get("SERPAPI_MCP_URL", "")
    serpapi_mcp_url = (
        f"{_base_url}/{serapi_key}/mcp" if serapi_key and _base_url else _base_url
    )

    MCP_SERVERS: Dict[str, str] = {
        "local": "http://127.0.0.1:8282/mcp",
        "serpapi": serpapi_mcp_url,
    }

    system_prompt = (
        "You are an agent. Use tools when helpful. "
        "If you call a tool, use the tool result to produce the final answer."
    )

    async with AsyncExitStack() as stack:
        sessions: Dict[str, ClientSession] = {}

        # 각 Mcp 서버 initialize + tools/list 호출
        openai_tools: List[Dict[str, Any]] = []
        route_map: Dict[str, Dict[str, str]] = {}

        for key, url in MCP_SERVERS.items():
            if not url:
                print(f"[WARN] Skipping {key} because URL is empty")
                continue

            try:
                # streamable_http_client 컨텍스트 진입
                ctx = streamable_http_client(url)
                read_stream, write_stream, _meta = await stack.enter_async_context(ctx)

                # ClientSession 컨텍스트 진입
                session = ClientSession(read_stream, write_stream)
                await stack.enter_async_context(session)
                await session.initialize()

                sessions[key] = session

                tools_resp = await session.list_tools()
                # MCP tool -> OpenAI tools(function calling) 형태로 변환.
                tools_out, routes_out = build_openai_tools_and_routes(
                    key, tools_resp.tools
                )
                openai_tools.extend(tools_out)
                route_map.update(routes_out)
            except Exception as e:
                print(f"[ERROR] Failed to connect to {key} at {url}: {e}")
                continue

        messages: List[Dict[str, Any]] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text},
        ]

        # LLM tool-calling 루프
        MAX_TOOL_TURNS = 6
        for _ in range(MAX_TOOL_TURNS):
            resp = await llm_chat(
                llm_base, llm_key, llm_model, messages, tools=openai_tools
            )
            assistant_msg = get_choice_message(resp)

            tool_calls = assistant_msg.get("tool_calls") or []
            messages.append(assistant_msg)

            if not tool_calls:
                return assistant_msg.get("content", "") or ""

            print(f"============ [DEBUG] 선택된 Tools: {tool_calls} ============")

            # tool 실행(라우팅)
            for tc in tool_calls:
                fn = tc.get("function") or {}
                namespaced_name = fn.get("name")
                raw_args = fn.get("arguments") or "{}"

                if not namespaced_name or namespaced_name not in route_map:
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tc.get("id"),
                            "content": json.dumps(
                                {
                                    "ok": False,
                                    "error": {
                                        "code": "UNKNOWN_TOOL",
                                        "name": namespaced_name,
                                    },
                                },
                                ensure_ascii=False,
                            ),
                        }
                    )
                    continue

                try:
                    args = (
                        json.loads(raw_args)
                        if isinstance(raw_args, str)
                        else (raw_args or {})
                    )
                except Exception:
                    args = {}

                print(f"============ [DEBUG] args: {args} ============")

                route = route_map[namespaced_name]
                server_key = route["server_key"]
                real_name = route["tool_name"]

                session = sessions.get(server_key)
                if not session:
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tc.get("id"),
                            "content": json.dumps(
                                {"ok": False, "error": "Session not available"}
                            ),
                        }
                    )
                    continue

                try:
                    result = await session.call_tool(real_name, arguments=args)
                    tool_text = as_text_from_calltool_result(result)
                except Exception as e:
                    tool_text = json.dumps({"ok": False, "error": str(e)})

                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.get("id"),
                        "content": tool_text,
                    }
                )

        return "Tool loop limit reached."
\`\`\``;export{n as default};
