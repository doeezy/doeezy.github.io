const n=`---
title: Web APIs
date: 2025-06-16
tags:
  - javascript
  - frontend
  - browser
  - Web-APIs
---

### 💣💥 이게 뭔데?

---

브라우저가 제공하는 \`비동기 기능들의 집합\`

자바스크립트 일부 아님 ❌

### 🎃 그래서 그게 뭔데

---

\`\`\`jsx
setTimeout(() => console.log("hello"), 1000);
\`\`\`

\`setTimeout()\` 은 JS에 내장된 함수가 아님

\`브라우저(Web API)\` 에서 제공하는 기능임

JS는 이걸 브라우저에 맡기고 완료되면 콜백 큐에 넣으라고 함

또는

\`\`\`jsx
fetch("https://api.com/data");
\`\`\`

이 \`fetch()\`도 JS가 제공하는게 아니라 **브라우저가 구현한 API임**

### 🎃 대표적인 Web APIs 종류

---

| Web API 종류 | 예시 기능 |
| --- | --- |
| **Timer APIs** | \`setTimeout\`, \`setInterval\`, \`clearTimeout\` |
| **Network APIs** | \`fetch\`, \`XMLHttpRequest\`, WebSocket |
| **DOM APIs** | \`document.querySelector\`, \`addEventListener\`, \`innerHTML\` |
| **Storage APIs** | \`localStorage\`, \`sessionStorage\`, \`IndexedDB\` |
| **기타** | \`Geolocation\`, \`Notification\`, \`Canvas\`, \`Web Audio API\`, \`WebRTC\` 등등 |

### 🎃 이게 왜 중요함?

---

JS는 \`싱글 스레드\`라서 무거운 작업 못함 ❌

→ 그래서 브라우저가 대신 처리해주는거임

→ 다 끝나면 JS한테 “끝났어” 라고 알려주면서 Callback Queue로 보내줌

**이 구조 덕분에 JS는 싱글 스레드인데도 비동기 처리가 가능한 것**

### 💡 요약 한줄

> Web APIs는 브라우저가 제공하는 비동기 기능의 모음이고,
>
>
> JS는 걔네를 “위임”해서 쓰는 것 뿐임.
>
`;export{n as default};
