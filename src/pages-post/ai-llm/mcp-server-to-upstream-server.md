---
title: "[MCP] Mcp Server ↔ Mcp Server"
menu: ai-llm
date: 2026-02-09
tags:
  - MCP Server
  - LLM
  - AI Agent
---

# Mcp Server ↔ Upstream MCP 서버 연동

## 🚀 플로우

1. 업스트림 MCP 서버의 tool을 래핑한 MCP tool을 로컬 MCP Server에 정의함
2. 로컬 MCP 서버 실행 시 업스트림 MCP 서버에 대한 커넥터 생성
3. Wrapper tool(업스트림 서버의 tool을 래핑한 tool)이  선택되었을 경우
    - 커넥터로 업스트림 서버에 연결
    - 업스트림 서버의 실제 tool name과 input schema에 맞게 args 구성
    - 해당 툴 호출
4. 리턴된 결과를 그대로 mcp client로 리턴

```python
class UpstreamConn:
    """서버 내부에서 업스트림 MCP 서버에 붙는 커넥터(게이트웨이용)."""

    def __init__(self, url: str):
        self.url = url
        self._lock = asyncio.Lock()
        self._ctx = None
        self._streams = None
        self._session: Optional[ClientSession] = None

    async def get_session(self) -> ClientSession:
        async with self._lock:
            if self._session is not None:
                return self._session

            if not self.url:
                raise RuntimeError("SERPAPI_MCP_URL is not set")

            self._ctx = streamable_http_client(self.url)
            self._streams = await self._ctx.__aenter__()
            read_stream, write_stream, _meta = self._streams

            self._session = ClientSession(read_stream, write_stream)
            await self._session.__aenter__()
            await self._session.initialize()
            return self._session

    async def reset(self):
        async with self._lock:
            try:
                if self._session is not None:
                    await self._session.__aexit__(None, None, None)
            finally:
                self._session = None

            try:
                if self._ctx is not None:
                    await self._ctx.__aexit__(None, None, None)
            finally:
                self._ctx = None
                self._streams = None

serpapi = UpstreamConn(SERPAPI_MCP_URL)

# --- SerpApi 웹 검색 tool wrapper ---
@mcp.tool()
async def web_search(query: str, engine: str = "google_light", num: int = 5) -> dict:
    """
    SerpApi MCP Server를 통해 웹 검색을 수행합니다.
    최신 정보/검색 결과가 필요할 때 사용하세요. 검색 결과는 추측하지 말고 반드시 이 툴을 호출하세요.
    """
    print(f"============ [DEBUG] web_search: {query}, {engine}, {num} ============")

    if not SERPAPI_MCP_URL:
        return {
            "ok": False,
            "error": {
                "code": "CONFIG_MISSING",
                "message": "SERPAPI_MCP_URL or SERPAPI_API_KEY is not set in environment variables.",
            },
        }

    try:
        print("============ [DEBUG] upstream connect: start")
        session = await serpapi.get_session()
        print("============ [DEBUG] upstream connect: initialized")

        # SerpApi MCP Server의 tool inputSchema를 참고하여 arguments를 생성
        # Args:
        # params: Dictionary of engine-specific parameters. Common parameters include:
        #     - q: Search query (required for most engines)
        #     - engine: Search engine to use (default: "google_light")
        #     - location: Geographic location filter
        #     - num: Number of results to return

        # mode: Response mode (default: "complete")
        #     - "complete": Returns full JSON response with all fields
        #     - "compact": Returns JSON response with metadata fields removed
        args = {
            "params": {"q": query, "engine": engine, "num": num},
            "mode": "compact",
        }

        result = await session.call_tool("search", arguments=args)

        # # Debugging용
        # resp = await session.list_tools()
        # print("[DEBUG] upstream tools:", resp.tools)

        content = getattr(result, "content", None)
        print("[DEBUG] content:", content)

        payload = _to_payload(result)
        payload.update(
            {
                "source": "serpapi_mcp_upstream",
                "upstream_tool": "search",
                "args": args,
            }
        )
        return payload

    except Exception as e:
        print("[ERROR] web_search failed:", repr(e))
        await serpapi.reset()
        return {"ok": False, "error": {"code": "WEB_SEARCH_FAILED", "message": str(e)}}
```