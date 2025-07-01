const n=`---\r
title: 함수 선언문 vs 함수 표현식 (호이스팅 차이)\r
menu: javascript\r
date: 2025-07-01\r
tags:\r
  - javascript\r
  - frontend\r
---\r
\r
# ✅ 함수 선언문과 함수 표현식 비교 !\r
\r
## 🧱 함수 선언문 (Function Declaration)\r
\r
\`\`\`jsx\r
sayHi(); // 가능\r
\r
function sayHi() {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
## 🧱 함수 표현식 (Function Expression)\r
\r
\`\`\`jsx\r
sayHi(); // TypeError: sayHi is not a function\r
\r
var sayHi = function () {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
---\r
\r
### 🤷🏾‍♀️ 왜 다른거임?\r
\r
👊🏾 JS는 실행 전에 다음 2가지를 함:\r
\r
1. **변수랑 함수 선언을 싹 모음**\r
2. 함수 선언문이면 → 🚨 **함수 본문까지 통째로 등록함**\r
\r
📍 선언문\r
\r
- 형태 → \`function func()\`\r
- 호이스팅됨? → ⭕ **함수 전체** 호이스팅\r
- 언제부터 쓸 수 있음? → 선언 **이전에도** 호출 가능\r
\r
📍 표현식\r
\r
- 형태 → \`var func = function()\`\r
- 호이스팅됨? → ⭕ **변수만** 호이스팅 (값은 undefined)\r
- 언제부터 쓸 수 있음? → 선언 **이후부터**만 사용 가능\r
\r
---\r
\r
### 🤷🏾‍♀️ 함수도 호이스팅된다는데 왜 어떤 건 되고 어떤 건 안 돼?\r
\r
자바스크립트는 실행 전에 변수랑 함수 선언부터 싹 긁어 모아서 정리함!\r
\r
\`\`\`jsx\r
console.log(foo);  // undefined\r
foo();             // TypeError: foo is not a function\r
\r
var foo = function () {\r
  console.log("bar");\r
};\r
\`\`\`\r
\r
<br>\r
\r
📈 실행 흐름\r
\r
1. 호이스팅 시:\r
\r
    \`\`\`jsx\r
    var foo; // 선언만 호이스팅 됨. 값은 undefined\r
    \`\`\`\r
\r
2. \`console.log(foo)\` → \`undefined\`\r
3. \`foo()\` → \`undefined\` 아직 함수가 선언되지 않음. \`undefined()\`  호출을 시도하면 함수가 아닌 값을 호출했기 때문에 TypeError\r
\r
---\r
\r
## ⚡ \`const\`로 표현식 작성해도 에러남?\r
\r
→ YES ⭕ 근데 Error 타입이 다름\r
\r
\`\`\`jsx\r
foo(); // ReferenceError\r
\r
const foo = () => {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
<br>\r
\r
### 😮 왜 \`var\`일 땐 \`TypeError\`고, \`const\`일 땐 \`ReferenceError\`임?\r
\r
📍 \`var\`\r
\r
- 에러 종류 → TypeError\r
- 이유 → 변수는 선언됐지만 값은 undefined\r
\r
📍 \`let\` / \`const\`\r
\r
- 에러 종류 → ReferenceError\r
- 이유 → **TDZ(초기화 전 접근 금지)** 때문에 아예 접근 자체가 안됨\r
`;export{n as default};
