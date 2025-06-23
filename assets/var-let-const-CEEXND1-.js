const n=`---\r
title: var, let, const, 호이스팅\r
date: 2025-06-16\r
tags:\r
  - javascript\r
  - frontend\r
  - browser\r
  - Web-APIs\r
---\r
\r
\r
# 🚀 var, let, const 특징과 차이\r
\r
|  | \`var\` | \`let\` | \`const\` |\r
| --- | --- | --- | --- |\r
| 스코프 | **함수 스코프** | **블록 스코프** | **블록 스코프** |\r
| 호이스팅 | 됨 (초기화는 안 됨) | 됨 (하지만 TDZ 발생) | 됨 (하지만 TDZ 발생) |\r
| 재선언 | 가능  | 불가능  | 불가능  |\r
| 재할당 | 가능 | 가능 | 불가능 (단, 객체 내부는 가능) |\r
| 사용 추천? | 비권장 | 일반 변수 | 상수, 변하지 않는 값 |\r
\r
<br>\r
\r
---\r
\r
## ⭐ Scope의 차이\r
\r
\`\`\`jsx\r
if(true) {\r
	var a = 1;\r
	let b = 2;\r
	const c = 3;\r
}\r
\r
console.log(a); // 1\r
console.log(b); // ReferenceError\r
console.log(c); // ReferenceError\r
\`\`\`\r
\r
📍 \`var\` 은 if문 같은 블록 구분을 무시하고 **함수 전체에서 살아있음**\r
\r
📍 \`let\`, \`const\` 는 **블록 내부에서만 유효**\r
\r
<br>\r
\r
\r
## ⭐ 호이스팅\r
\r
\`\`\`jsx\r
console.log(a); // undefined\r
var a = 10;\r
\r
console,log(b);\r
let b = 20;\r
\`\`\`\r
\r
📍 \`var\` 은 선언이 끌어올려져서 \`undefined\`로 뜸 (초기화 안됨 ❌)\r
\r
📍 \`let\`, \`const\`도 호이스팅은 되는데 초기화 전까지는 TDZ(Temporal Dead Zone) 라는 **접근 불가 구간**에 있음 → 그래서 오류\r
\r
---\r
\r
### 💣 💥 호이스팅이 뭔데?\r
\r
**변수 선언**과 **함수 선언**이 실행 전에 코드의 맨 위로 끌어올려지는 현상\r
\r
자바스크립트 엔진이 실행 준비를 할 때, 선언을 먼저 등록해두는 내부 처리 과정\r
\r
\`\`\`jsx\r
console.log(x); // undefined\r
var x = 10;\r
\`\`\`\r
\r
이게 동작하는 이유는\r
\r
자바스크립트가 내부적으로 이렇게 바꾸기 때문임\r
\r
\`\`\`jsx\r
var x; // 선언만 먼저 한 상태 (초기화 X)\r
console.log(x); // undefined\r
x = 10;\r
\`\`\`\r
\r
이렇게 변수 선언이 먼저 등록돼 있어서 오류가 안나고 \`undefined\` 로 처리되는것임\r
\r
<br>\r
\r
🔥 함수 호이스팅은 또 다름\r
\r
\`\`\`jsx\r
foo(); // 함수 호출 가능\r
function foo() {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
함수 선언문은 전체 통째로 호이스팅 됨. 그래서 선언 전에 호출해도 문제 없음 ❌\r
\r
💥 하지만 ! 함수 표현식은 \`var bar\`만 호이스팅되고(=변수만 호이스팅 됨) 값은 undefined라서 호출 시 에러 발생함\r
\r
\`\`\`jsx\r
bar(); // TypeError\r
var bar = function () {\r
	console.log("hello");\r
}\r
\`\`\`\r
\r
\`\`\`jsx\r
foo(); // ReferenceError\r
\r
const foo = () => {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
\`const\` 는 호이스팅 되지만 → TDZ가 생김\r
\r
내부적으로는 이렇게 처리됨\r
\r
\`\`\`jsx\r
// 선언 (호이스팅 OK)\r
const foo; // 아직 초기화 전 -> TDZ에 있음\r
\r
foo(); // 여기서 ReferenceError 발생\r
\r
foo = () => {\r
	console.log("hi");\r
}\r
\`\`\`\r
\r
---\r
\r
\r
\r
## ⭐ const는 진짜 불변?\r
\r
\`\`\`jsx\r
const obj = { name: "망고" };\r
obj.name = "사과"; // 가능 !\r
\r
obj = { name: "딸기" }; // TypeError\r
\`\`\`\r
\r
📍 **const는 변수 자체의 재할당을 막는 것.** 그 안에 든 객체나 배열은 바꿀 수 있음 → 얕은 불변성\r
\r
<br>\r
\r
## ⭐ var 은 왜 비추천?\r
\r
- 스코프가 널널해서 실수가 잦음\r
- 재선언 가능해서 변수 오염 가능성이 높음\r
- 호이스팅 + undefined 때문에 버그 찾기 어려움\r
`;export{n as default};
