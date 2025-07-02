const n=`---\r
title: 스코프(Scope), 스코프 체인(Scope Chain)\r
menu: javascript\r
date: 2025-01-01\r
tags:\r
  - javascript\r
  - frontend\r
---\r
# 🧠 스코프(Scope)?\r
\r
**변수에 접근할 수 있는 유효 범위** → 어디서 어떤 변수에 접근 가능한지 결정하는 규칙임\r
\r
---\r
\r
# 🛠️ 스코프 종류\r
\r
- 전역 스코프 → 함수 밖에서 선언된 변수 (**어디서든 접근 가능**)\r
- 함수 스코프 → 함수 내부에서 선언된 변수 (**함수 안에서만 유효**)\r
- 블록 스코프 → \`{}\` 중괄호 안 (**let, const만 적용됨**)\r
\r
<br>\r
\r
\r
## 🙄 왜 let, const만 블록 스코프 적용됨?\r
\r
<br>\r
\r
✅ 자바스크립트 초창기 시절에는 \`var\`만 있었음\r
\r
블록 스코프라는 개념이 없었고, 오직 **함수 단위**로만 스코프를 나눌 수 있었음\r
\r
\`\`\`jsx\r
for (var i = 0; i < 3; i++) {\r
	// ...\r
}\r
console.log(i); // i 살아있음\r
\`\`\`\r
\r
<br>\r
\r
✅ ES6 에서 \`let\`, \`const\`가 등장함\r
\r
이때 **블록 스코프** 라는 개념이 JS에 도입됨\r
\r
\`let\`, \`const\`는 새로운 스펙으로 설계되었음\r
\r
\r
\`\`\`jsx\r
for (var i = 0; i < 3; i++) {\r
  setTimeout(() => console.log(i), 0);\r
}\r
// 결과: 3, 3, 3\r
\r
for (let i = 0; i < 3; i++) {\r
  setTimeout(() => console.log(i), 0);\r
}\r
// 결과: 0, 1, 2\r
\`\`\`\r
\r
📍 \`var\`는 함수 스코프 → i가 공유됨\r
\r
📍 \`let\`은 블록 스코프 → 각 반복마다 새로운 i\r
\r
함수 스코프 변수는 전체 루프를 공유하고 블록 스코프 변수는 반복마다 새로 생성됨\r
\r
<br>\r
\r
\r
## 🔥 \`var\` 일 때\r
\r
- 루프 종료 후 \`i = 3\` 됨\r
- setTimeout은 **나중에 실행** → 루프는 이미 끝나고 \`i === 3\`\r
- 모든 타이머 콜백은 공유된 **i = 3을 참조함**\r
\r
## 🔥 \`let\` 일 때\r
\r
- 루프를 돌 때마다 **각각 다른 \`i\`가 생성됨**\r
- 타이머 콜백도 각각 자신만의 \`i\`를 캡쳐해서 기억함\r
\r
\`\`\`jsx\r
{\r
  let i = 0; // 첫 번째 블록\r
  setTimeout(() => console.log(i), 0);\r
}\r
{\r
  let i = 1; // 두 번째 블록\r
  setTimeout(() => console.log(i), 0);\r
}\r
{\r
  let i = 2; // 세 번째 블록\r
  setTimeout(() => console.log(i), 0);\r
}\r
\`\`\`\r
\r
\`let i = 0\`으로 시작해서 블록 스코프에 \`i\`가 하나 생기고 루프를 한 번 돌고 다음 루프로 넘어갈 때\r
→ 자바스크립트가 **이전 \`i\`를 복사해서 새로운 블록을 만들어줌**\r
\r
→ 각각의 콜백은 **자기만의 i** 를 참조함\r
\r
그래서 결과는:\r
\r
\`\`\`\r
0 1 2\r
\`\`\`\r
\r
---\r
\r
# 📦 Scope Example\r
\r
\`\`\`jsx\r
let a = 1; // ✅ 전역 스코프\r
\r
function foo() {\r
	let b = 2; // ✅ 함수 스코프\r
\r
	if(true) {\r
		let c = 3; // ✅ 블록 스코프\r
		console.log(a, b, c); // 전부 접근 가능\r
	}\r
\r
	console.log(c); // ReferenceError\r
}\r
\`\`\`\r
\r
- \`a\` : 어디서든 접근 가능\r
- \`b\`: foo 함수 안에서만 접근 가능\r
- \`c\`: if 블록 안에서만 접근 가능\r
\r
\r
---\r
\r
# 🧠 스코프 체인(Scope Chain)?\r
\r
변수나 함수를 찾을 때 **현재 스코프 → 바깥 스코프 → 더 바깥 스코프 ... → 전역 스코프까지** 순차적으로 타고 올라가서 찾는 구조\r
\r
→ 실행 중에 JS가 “변수 어디있음?” 하면서 스코프를 타고 올라가는 과정\r
\r
JS는 **렉시컬 스코프(lexical scope)** 언어라 스코프 체인은 **코드가 선언된 위치 기준**으로 결정됨\r
\r
---\r
\r
## 📦 Scope Chain Example\r
\`\`\`jsx\r
let a = "global";\r
\r
function outer() {\r
	let b = "outer";\r
\r
	function inner() {\r
		let c = "inner";\r
		console.log(a); // global\r
    console.log(b); // outer\r
    console.log(c); // inner\r
	}\r
\r
	inner();\r
}\r
outer();\r
\`\`\`\r
\r
\r
### ⭐ 실행 순서\r
\r
1. \`c\` 찾음 → inner 스코프\r
2. \`b\` 찾음 → inner에 없음 → outer 스코프에서 찾음\r
3. \`a\` 찾음 → inner에 없음 → outer에 없음 → global 스코프에서 찾음\r
\r
스코프 체인은 JS가 변수를 탐색할 때 **내부 → 외부 → 전역** **순으로 따라가는 경로**다.\r
\r
\`\`\`jsx\r
[Global Scope]  ← a\r
\r
  ↓\r
\r
[outer Scope]   ← b\r
\r
  ↓\r
\r
[inner Scope]   ← c\r
\`\`\`\r
\r
<br>\r
\r
\r
## 💣💥 **선언된 위치 기준으로 스코프 체인이 정해진다는게 뭔 말임?**\r
\r
JS는 함수가 **어디서 실행되냐**가 아니라 **어디서 정의(선언)됐냐**를 기준으로 스코프 체인을 만듬 !\r
\r
\`\`\`jsx\r
let x = 1;\r
\r
function foo() {\r
  console.log(x);\r
}\r
\r
function bar() {\r
  let x = 2;\r
  foo(); // 이 foo는 전역에서 정의된 foo\r
}\r
\r
bar(); // 출력: 1\r
\`\`\`\r
\r
\`\`\`jsx\r
let x = 1;\r
\r
function bar() {\r
  let x = 2;\r
\r
  function foo() {\r
    console.log(x);\r
  }\r
\r
  foo();\r
}\r
\r
bar(); // 출력: 2\r
\`\`\`\r
`;export{n as default};
