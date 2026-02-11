const n=`---
title: 함수 선언문 vs 함수 표현식 (호이스팅 차이)
menu: javascript
date: 2025-01-01
tags:
  - javascript
  - frontend
---

# ✅ 함수 선언문과 함수 표현식 비교 !

## 🧱 함수 선언문 (Function Declaration)

\`\`\`jsx
sayHi(); // 가능

function sayHi() {
	console.log("hi");
}
\`\`\`

## 🧱 함수 표현식 (Function Expression)

\`\`\`jsx
sayHi(); // TypeError: sayHi is not a function

var sayHi = function () {
	console.log("hi");
}
\`\`\`

---

### 🤷🏾‍♀️ 왜 다른거임?

👊🏾 JS는 실행 전에 다음 2가지를 함:

1. **변수랑 함수 선언을 싹 모음**
2. 함수 선언문이면 → 🚨 **함수 본문까지 통째로 등록함**

📍 선언문

- 형태 → \`function func()\`
- 호이스팅됨? → ⭕ **함수 전체** 호이스팅
- 언제부터 쓸 수 있음? → 선언 **이전에도** 호출 가능

📍 표현식

- 형태 → \`var func = function()\`
- 호이스팅됨? → ⭕ **변수만** 호이스팅 (값은 undefined)
- 언제부터 쓸 수 있음? → 선언 **이후부터**만 사용 가능

---

### 🤷🏾‍♀️ 함수도 호이스팅된다는데 왜 어떤 건 되고 어떤 건 안 돼?

자바스크립트는 실행 전에 변수랑 함수 선언부터 싹 긁어 모아서 정리함!

\`\`\`jsx
console.log(foo);  // undefined
foo();             // TypeError: foo is not a function

var foo = function () {
  console.log("bar");
};
\`\`\`

<br>

📈 실행 흐름

1. 호이스팅 시:

    \`\`\`jsx
    var foo; // 선언만 호이스팅 됨. 값은 undefined
    \`\`\`

2. \`console.log(foo)\` → \`undefined\`
3. \`foo()\` → \`undefined\` 아직 함수가 선언되지 않음. \`undefined()\`  호출을 시도하면 함수가 아닌 값을 호출했기 때문에 TypeError

---

## ⚡ \`const\`로 표현식 작성해도 에러남?

→ YES ⭕ 근데 Error 타입이 다름

\`\`\`jsx
foo(); // ReferenceError

const foo = () => {
	console.log("hi");
}
\`\`\`

<br>

### 😮 왜 \`var\`일 땐 \`TypeError\`고, \`const\`일 땐 \`ReferenceError\`임?

📍 \`var\`

- 에러 종류 → TypeError
- 이유 → 변수는 선언됐지만 값은 undefined

📍 \`let\` / \`const\`

- 에러 종류 → ReferenceError
- 이유 → **TDZ(초기화 전 접근 금지)** 때문에 아예 접근 자체가 안됨
`;export{n as default};
