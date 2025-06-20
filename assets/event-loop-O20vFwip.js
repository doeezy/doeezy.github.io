const n=`---
title: Event Loop
date: 2025-06-16
tags:
  - javascript
  - frontend
---

### 💣💥 이게 뭔데?

---

JS가 \`싱글 스레드 인데도 비동기처럼 처리할 수 있게 해주는 매커니즘\` 임

말하자면 **큐 관리인** 임

메인 스레드가 놀면 바로 다음 작업 처리해줄게 ~

이런 느낌

<br>


### ⭐ Event Loop는 어디에 속해있는 애임?

---

Event Loop는 JS 언어 내부에도 없고

**브라우저나 Node.js 같은 실행 환경에서 구현된 기능**임

즉,

**JS 엔진 = Event Loop 없음 ❌**

**브라우저 / Node.js = Event Loop 있음 ✅**

<br>


### ⭐ JS 실행 환경은 기본적으로 Event Loop를 가지고 있는거임?

---

YES.

JS 실행 환경이면 기본적으로 갖고 있어야 함

왜? JS 자체가 싱글 스레드라서 비동기 처리를 하려면 반드시 Event Loop 구조가 필요함

<br>

📌 JS 실행 환경이 뭔데?

**"JS 코드를 실행시켜주는 시스템"**

| 실행 환경 | 설명 |
| --- | --- |
| **브라우저** | Chrome, Firefox, Safari 등 |
| **Node.js** | JS를 서버에서도 쓸 수 있게 만든 런타임 |
| **Deno** | Node.js의 대체 런타임 (진짜 최신형) |

<br>


📌그럼 걔네는 Event Loop를 어떻게 제공함?

---

| 환경 | Event Loop 있음? | 누가 구현? |
| --- | --- | --- |
| **브라우저** | 있음 ✅ | 각 브라우저 벤더가 구현 (크롬은 Chromium) |
| **Node.js** | 있음 ✅ | libuv 라는 C 라이브러리로 구현함 |
| **Deno** | 있음 ✅ | Rust로 짜여진 Tokio 기반 Event Loop |

즉, **실행 환경마다 구현 방식은 달라도, Event Loop는 무조건 있음.**

<br>
<br>


### 🎃 구성 요소

---

\`Call Stack\`  → 현재 실행중인 코드 저장소 (함수 실행하면 여기에 쌓임)

\`Web APIs\` → 타이머, Ajax, DOM 이벤트 등 비동기 작업 처리기 (브라우저에서 제공) [Web APIs](https://www.notion.so/Web-APIs-1eed7460d3b4808fa7addc52afccca50?pvs=21)

\`Callback Queue\` → 완료된 비동기 작업의 콜백이 대기하는 곳

\`Event Loop\` → Call Stack이 비면 Callback Queue에서 콜백 꺼내서 실행 시킴

⭐ **Task Queue 말고도 Microtask Queue가 있음**

Promise \`.then()\` 이나 \`async/awiat\` 의 콜백은 **Microtask Queue에 들어감**

이 큐는 Callback Queue(=Task Queue)보다 **우선 순위가 더 높음**

\`\`\`jsx
async function test() {
  console.log("1");
  await fetch("/api/data");  // ← fetch()는 Promise 반환
  console.log("2");          // ← 이게 나중에 실행됨 (Microtask로)
}
\`\`\`

<br>
<br>

### 🎃 구조

---

1. JS 코드 실행 → \`싱글 스레드\` 에서 실행함
2. 비동기 작업 발견 (ex. axios, setTiomeout)
   → 얘네는 **브라우저 OR Node가 가진 Web APIs / Background Thread 쪽으로 던짐**
3. 작업 끝나면 **콜백 큐**로 옴
4. Event Loop가 메인 스레드가 비면, 콜백 큐에 있는 걸 하나씩 꺼내서 실행

<br>
<br>


### 🎃 흐름 요약
\`\`\`
[JS 실행] ─────→ 비동기 작업 발견  ─────┐
    ↓                                 ↓
나머지 코드 실행                백그라운드에서 실행
    ↓                                 ↓
콜백 큐          ←───────     작업 끝나면 콜백 등록
    ↓
[이벤트 루프] → 큐에서 꺼내서 다시 실행
\`\`\`
`;export{n as default};
