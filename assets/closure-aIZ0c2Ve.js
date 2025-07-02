const n=`---\r
title: 클로저\r
menu: javascript\r
date: 2025-01-01\r
tags:\r
  - javascript\r
  - frontend\r
---\r
\r
# 🧠 클로저?\r
\r
함수가 생성될 당시의 외부 변수(스코프)를 기억하고, 그 스코프에 계속 접근할 수 있는 함수\r
\r
쉽게 말해서 **함수 밖에서 만든 변수를, 함수 안에서 계속 쓸 수 있게 해주는 기술**이라고 할 수 있다.\r
\r
---\r
\r
## 📝 기본 예제\r
\r
\`\`\`jsx\r
function outer() {\r
  const name = "홍길동";\r
\r
  function inner() {\r
    console.log("Hello " + name);\r
  }\r
\r
  return inner;\r
}\r
\r
const greeting = outer(); // 함수 실행 후 없어짐\r
greeting(); // Hello gildong\r
\`\`\`\r
\r
- \`outer()\`가 실행되고 끝났는데도(없어졌는데도)\r
- \`inner()\`는 \`name\`을 여전히 기억함\r
\r
→ 이게 바로 클로저 ! 🚀\r
\r
클로저는 함수가 **"자기가 만들어질 당시의 스코프"**를 기억하는 기술\r
\r
<br>\r
\r
\r
## 🤷🏾‍♀️ 여기서 내가 든 의문\r
\r
\`outer()\` 안에서 \`inner()\` 함수를 선언했고, 그럼 \`inner()\` 함수는 내부 스코프부터 외부 스코프까지 LexicalEnvironment에 저장하니까 \`name\`을 기억하고 있는거 아님?\r
\r
이게 클로저라고????\r
\r
### 정답은 👊🏾💥\r
\r
LexicalEnvironment에 저장된 스코프 정보 덕분에 **클로저가 가능** 해지는 것임\r
\r
다만 LexicalEnvironments는 **함수가 만들어 질 때 정의되는 구조고,**\r
\r
클로저는 **함수가 실행된 이후에도 그 구조를 계속 “기억하고 있는 상태”**를 말함\r
\r
자바스크립트는 함수 실행이 끝나면 **함수의 실행 컨텍스트**를 메모리에서 날려버림! 🧹\r
\r
예를 들어:\r
\r
\`\`\`jsx\r
function outer() {\r
  const name = "홍길동";\r
  console.log("outer done");\r
}\r
\r
outer(); // 실행되고 끝남\r
\`\`\`\r
\r
→ \`outer()\` 끝나면 \`name\`도, outer의 컨텍스트도 **다 날아감**\r
\r
<br>\r
\r
\r
## 🤯 근데 어떻게 기억하고 있는거임?\r
\r
\`\`\`jsx\r
function outer() {\r
  const name = "홍길동";\r
\r
  function inner() {\r
    console.log("Hello " + name);\r
  }\r
\r
  return inner;\r
}\r
\r
const greeting = outer(); // 여기서 outer는 실행 끝났는데\r
greeting(); // 어떻게 name을 기억하고 있음?\r
\`\`\`\r
\r
- \`inner\` 함수가 \`name\`을 사용하고 있어서 JS 엔진이 “이 변수 아직 사용중이네?” 하고 스코프를 메모리에서 안 지우고 계속 보관하고 있음\r
\r
→ 클로저 덕분에 스코프가 살아있는 상태가 유지되는 것임\r
\r
---\r
\r
# 🔥 정리\r
\r
## 1. 함수는 “정의될 때” LexicalEnvironment를 저장함\r
\r
\`\`\`jsx\r
function outer() {\r
  const name = "홍길동";\r
  return function inner() {\r
    console.log(name);\r
  };\r
}\r
\`\`\`\r
\r
→ \`inner\`는 LexicalEnvironment를 기억하고 있음\r
\r
→ 이건 함수 객체 자체의 특성으로 생성 시점에 저장됨\r
\r
## 2. 함수가 “호출되면” 실행 컨텍스트가 생성됨\r
\r
\`\`\`jsx\r
const greeting = outer(); // outer의 실행 컨텍스트 생성됨 → 실행 끝나면 파괴\r
greeting();               // inner의 실행 컨텍스트가 새로 만들어짐\r
\`\`\`\r
\r
→ \`outer()\` 호출 → 실행 컨텍스트 생성 → 종료 → 삭제\r
\r
→ \`greeting()\`  호출 → \`inner\`의 새 실행 컨텍스트 생성\r
\r
## 3. 근데 클로저는 “LexicalEnv를 기억해서” 외부 스코프에 접근 가능함\r
\r
→ \`inner()\`는 자기 LexicalEnv에 \`outer\` 스코프 참조를 가지고 있음\r
\r
→ 이 참조가 살아있으면 해당 외부 변수도 GC(가비지 컬렉터)가 안 지움\r
\r
---\r
\r
## 🔍 클로저가 만들어지는 조건\r
\r
1. **함수 안에서 또 다른 함수를 리턴하거나 반환할 때**\r
2. 내부 함수가 외부 함수의 변수에 접근할 때\r
3. 외부 함수 실행이 끝나도, 내부 함수가 살아있을 때\r
\r
---\r
\r
## 🔔 Quiz\r
\r
❓ Q1. 다음 코드의 출력 결과는?\r
\r
\`\`\`jsx\r
function makeCounter() {\r
  let count = 0;\r
\r
  return function () {\r
    count++;\r
    console.log(count);\r
  };\r
}\r
\r
const counter1 = makeCounter();\r
const counter2 = makeCounter();\r
\r
counter1(); // ?\r
counter1(); // ?\r
counter2(); // ?\r
\`\`\`\r
\r
🙋🏾‍♀️ 1, 2, 1\r
\r
클로저별 스코프는 분리됨.\r
\r
\`\`\`jsx\r
const counter1 = makeCounter(); // count = 0 (A)\r
const counter2 = makeCounter(); // count = 0 (B)\r
\`\`\`\r
\r
- \`counter1()\` → 1\r
- \`counter1()\` → 2 (A의 count가 유지됨)\r
- \`counter2()\` → 1 (B의 count는 별도 클로저)\r
\r
<br>\r
\r
❓ Q2. 다음 코드에서 콘솔에 뭐가 찍힐까?\r
\r
\`\`\`jsx\r
function outer(x) {\r
  return function inner(y) {\r
    console.log(x + y);\r
  };\r
}\r
\r
const add5 = outer(5);\r
add5(3); // ?\r
add5(10); // ?\r
\`\`\`\r
\r
🙋🏾‍♀️ 8, 15\r
\r
\`\`\`jsx\r
const add5 = outer(5); // x = 5 저장됨\r
add5(3); // x = 5, y = 3 → 8\r
add5(10); // x = 5, y = 10 → 15\r
\`\`\`\r
\r
<br>\r
\r
❓ Q3. 다음 코드의 동작 결과를 설명하시오\r
\r
\`\`\`jsx\r
function wrapper() {\r
  let secret = "비밀";\r
\r
  return {\r
    getSecret: function () {\r
      return secret;\r
    },\r
    setSecret: function (newSecret) {\r
      secret = newSecret;\r
    },\r
  };\r
}\r
\r
const safe = wrapper();\r
console.log(safe.getSecret()); // ?\r
safe.setSecret("메롱");\r
console.log(safe.getSecret()); // ?\r
\`\`\`\r
\r
🙋🏾‍♀️ 비밀, 메롱\r
`;export{n as default};
