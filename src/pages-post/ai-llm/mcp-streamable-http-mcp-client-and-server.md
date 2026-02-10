---
title: "[MCP] Streamable HTTP 기반 MCP Client / Server"
menu: ai-llm
date: 2026-02-09
tags:
  - MCP Client
  - MCP Server
  - LLM
  - AI Agent
---

# 🛠️ 스펙

### 1. MCP SDK 라이브러리 -> MCP 프로토콜 규격 라이브러리

- Client ↔ Server 간 표준 메시지 규격(JSON-RPC 기반) 처리
- initialize, list_tools, call_tool 같은 MCP 표준 API 제공

### 2. Streamable HTTP 기반 통신

### 3. Python

### 4. OpenAI API(LLM)


# 로컬 MCP Server 구현

1. **MCP Server는 툴 실행기**

    → 등록된 툴을 실행해서 **결과만 반환**하는 역할


2. **tools/list는 직접 구현하지 않아도 됨**

    → MCP SDK(FastMCP)가 서버 기동 시 등록된 툴들을 스캔함.

    list_tools() 요청(=tools/list)에 대해 자동으로 툴 메타데이터를 반환해줌.

    서버에는 @mcp.tool()로 함수만 등록하면 됨.


3. **툴 메타데이터 자동 생성**

    → MCP SDK 실행시 내부 흐름

    - @mcp.tool()로 등록된 함수 스캔
    - 함수 이름 → tool.name
    - 함수 docstring → tool.description
    - 함수 시그니처 + 타입 힌트 → tool.inputSchema (Json Schema)

4. **docstring(=description)은 LLM을 위한 가이드**

    → LLM이 툴을 고를 때 볼 수 있는 정보는 대부분

    - tool name
    - tool description
    - input schema

    이기 때문에 description이 빈약하면 툴을 안 쓰거나 잘못된 툴을 고르는 경우가 생김

<br/>

```python
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("Local MCP PoC", json_response=True, stateless_http=True)

@mcp.tool()
def add(a: int, b: int) -> int:
    """
    Add two numbers and return the exact sum.
    Use this tool when the user asks for arithmetic calculation
    or when an exact numeric result is required.
    Do not use this for estimation or explanation.
    """  # tool의 description으로 생성됨

    # 두 숫자를 더해 정확한 합계를 반환합니다.
    # 사용자가 산술 계산을 요청했거나
    # 정확한 숫자 결과가 필요한 경우에 이 툴을 사용하세요.
    # 추정이나 설명 용도로는 사용하지 마세요.

    return {"a": a, "b": b, "sum": a + b}

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """
    Multiply two numbers and return the exact product.
    Use this tool when the user asks for arithmetic calculation
    or when an exact numeric result is required.
    Do not use this for estimation or explanation.
    """
    # 두 숫자를 곱하여 정확한 곱셈 결과를 반환합니다.
    # 사용자가 산술 계산을 요청했거나
    # 정확한 숫자 결과가 필요한 경우에 이 툴을 사용하세요.
    # 추정이나 설명 용도로는 사용하지 마세요.

    return {"a": a, "b": b, "sum": a * b}

USERS = {
    "도희정": {
        "role": "member",
        "role_name": "프로",
        "department": "IA 팀",
        "email": "dohxxzun@mobigen.com",
        "phone": "010-6210-xxxx",
    },
    "이동주": {
        "role": "team-leader",
        "role_name": "팀장",
        "department": "IA 팀",
        "email": "ainory@mobigen.com",
        "phone": "010-8792-xxxx",
    },
}

@mcp.tool()
def get_user(username: str) -> dict:
    """
    Retrieve user information by username and return the stored user data.
    Use this tool when the user asks about a specific user's details,
    such as role, profile, or any stored attributes.
    This tool is the authoritative source of user information.
    Do not guess or fabricate user data without calling this tool.
    """
    # 사용자 이름을 기준으로 저장된 사용자 정보를 반환합니다.
    # 특정 사용자의 역할, 프로필 등 세부 정보를 물어볼 때 사용하세요.
    # 이 툴은 사용자 정보에 대한 신뢰 가능한 단일 출처입니다.
    # 이 툴을 호출하지 않고 사용자 정보를 추측하거나 만들어내지 마세요.

    user = USERS.get(username)
    if not user:
        return {
            "ok": False,
            "error": {
                "code": "NOT_FOUND",
                "message": "User not found",
                "username": username,
            },
        }

    return {"ok": True, "user": user}

if __name__ == "__main__":
    print("Starting MCP Server on <http://localhost:8000/mcp>")
    # 기본 엔드포인트는 <http://localhost:8000/mcp로> 뜸
    mcp.run(transport="streamable-http")
```


# 로컬 MCP Client 구현

### 📌

이번 PoC의 LLM은 OpenAI의 Chat Completions API 표준을 따랐음

해당 규격은 공식문서에서 확인 가능 👇🏾

https://platform.openai.com/docs/api-reference/chat/create


### 동작 흐름

1. session.initialize(): MCP 핸드셰이크로 세션 시작
2. session.list_tools(): 서버가 제공하는 tool matadata 수집(툴 목록)
3. tool metadata를 LLM tool schema(OpenAI API 규격)로 변환
4. 사용자 질문 + tools를 LLM에 전달
5. LLM 응답에서 tool_calls 파싱
6. session.call_tool(name, args)로 서버 tool 실행
7. tool 결과를 role=”tool” 메시지로 LLM에 재투입
8. 최종 content가 나올 때까지 반복

```python
import asyncio
import json
import os
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv

from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
from mcp import types as mcp_types

def mcp_tools_to_openai_tools(mcp_tools: List[mcp_types.Tool]) -> List[Dict[str, Any]]:
    """
    MCP tool -> OpenAI tools(function calling) 형태로 변환.
    MCP Tool의 inputSchema를 OpenAI function.parameters로 그대로 씀.
    """
    out: List[Dict[str, Any]] = []
    for t in mcp_tools:
        out.append(
            {
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description or "",
                    "parameters": t.inputSchema or {"type": "object", "properties": {}},
                },
            }
        )
    return out

async def llm_chat(
    base_url: str,
    api_key: str,
    model: str,
    messages: List[Dict[str, Any]],
    tools: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"model": model, "messages": messages}
    if tools is not None:
        payload["tools"] = tools
        payload["tool_choice"] = "auto"

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=90.0) as client:
        r = await client.post(
            f"{base_url.rstrip('/')}/chat/completions", headers=headers, json=payload
        )
        r.raise_for_status()
        return r.json()

def get_choice_message(resp: Dict[str, Any]) -> Dict[str, Any]:
    # llm(openai api 기준)의 응답에서 선택된 메시지를 추출
    choices = resp.get("choices", [])
    if not choices:
        return {"role": "assistant", "content": "LLM returned no choices."}
    return choices[0].get("message", {"role": "assistant", "content": ""})

def as_text_from_calltool_result(result: mcp_types.CallToolResult) -> str:
    """
    MCP CallToolResult를 LLM에 넣기 좋은 문자열로 변환.
    json_response=True면 structuredContent가 채워질 가능성이 큼.
    """
    if getattr(result, "structuredContent", None):
        return json.dumps(result.structuredContent, ensure_ascii=False)

    # fallback: content block들 텍스트로 합치기
    parts = []
    for c in result.content or []:
        if isinstance(c, mcp_types.TextContent):
            parts.append(c.text)
        else:
            parts.append(str(c))
    return "\n".join(parts).strip() or "{}"

async def run_agent(user_text: str) -> str:
    load_dotenv()

    mcp_url = "http://127.0.0.1:8000/mcp"

    llm_base = os.environ["LLM_BASE_URL"]
    llm_key = os.environ["LLM_API_KEY"]
    llm_model = os.environ.get("LLM_MODEL", "gpt-4.1-mini")

    system_prompt = (
        "You are an agent. Use tools when helpful. "
        "If you call a tool, use the tool result to produce the final answer."
    )

    # MCP 서버 연결 (Streamable HTTP)
    async with streamable_http_client(mcp_url) as (read_stream, write_stream, _meta):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()  # MCP 핸드셰이크

            # MCP SDK에서 제공하는 ClientSession의 내장 함수
            # MCP 프로토콜의 tools/list 요청
            tools_resp = await session.list_tools()
            # MCP tool -> OpenAI tools(function calling) 형태로 변환.
            openai_tools = mcp_tools_to_openai_tools(tools_resp.tools)

            messages: List[Dict[str, Any]] = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text},
            ]

            # LLM tool-calling 루프
            for _ in range(8):
                resp = await llm_chat(
                    llm_base, llm_key, llm_model, messages, tools=openai_tools
                )
                assistant_msg = get_choice_message(resp)

                # llm(openai api 기준)의 응답에서 tool_calls를 추출
                tool_calls = assistant_msg.get("tool_calls") or []
                messages.append(assistant_msg)

                # tool_calls 없으면 최종 답변으로 종료
                if not tool_calls:
                    return assistant_msg.get("content", "") or ""

                print(f"============ [DEBUG] 선택된 Tools: {tool_calls} ============")

                # tool 실행
                for tc in tool_calls:
                    fn = tc.get("function") or {}
                    name = fn.get("name")
                    raw_args = fn.get("arguments") or "{}"

                    try:
                        args = (
                            json.loads(raw_args)
                            if isinstance(raw_args, str)
                            else (raw_args or {})
                        )
                    except Exception:
                        args = {}

                    # MCP tool call
                    result = await session.call_tool(name, arguments=args)
                    tool_text = as_text_from_calltool_result(result)
                    print(f"============ [DEBUG] Tool Result: {tool_text} ============")

                    # OpenAI tool message 형태로 LLM에 결과 전달
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tc.get("id"),
                            "content": tool_text,
                        }
                    )

            return "Tool loop limit reached."

async def main():
    print("MCP Client Agent (type 'exit' to quit)")
    while True:
        q = input("질문: ").strip()
        if q.lower() in ("exit", "quit"):
            break
        ans = await run_agent(q)
        print(f"답변: {ans}")

if __name__ == "__main__":
    asyncio.run(main())

```