---
title: var, let, const, 호이스팅
menu: javascript
date: 2025-06-16
tags:
  - javascript
  - frontend
  - browser
  - Web-APIs
---


# 🧠 var, let, const 특징과 차이
<br>

|  | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 스코프 | **함수 스코프** | **블록 스코프** | **블록 스코프** |
| 호이스팅 | 됨 (초기화는 안 됨) | 됨 (하지만 TDZ 발생) | 됨 (하지만 TDZ 발생) |
| 재선언 | 가능  | 불가능  | 불가능  |
| 재할당 | 가능 | 가능 | 불가능 (단, 객체 내부는 가능) |
| 사용 추천? | 비권장 | 일반 변수 | 상수, 변하지 않는 값 |

<br>

---

## ⭐ Scope의 차이

```jsx
if(true) {
	var a = 1;
	let b = 2;
	const c = 3;
}

console.log(a); // 1
console.log(b); // ReferenceError
console.log(c); // ReferenceError
```

📍 `var` 은 if문 같은 블록 구분을 무시하고 **함수 전체에서 살아있음**

📍 `let`, `const` 는 **블록 내부에서만 유효**

<br>


## ⭐ 호이스팅

```jsx
console.log(a); // undefined
var a = 10;

console,log(b);
let b = 20;
```

📍 `var` 은 선언이 끌어올려져서 `undefined`로 뜸 (초기화 안됨 ❌)

📍 `let`, `const`도 호이스팅은 되는데 초기화 전까지는 TDZ(Temporal Dead Zone) 라는 **접근 불가 구간**에 있음 → 그래서 오류

---

### 💣💥 호이스팅이 뭔데?

**변수 선언**과 **함수 선언**이 실행 전에 코드의 맨 위로 끌어올려지는 현상

자바스크립트 엔진이 실행 준비를 할 때, 선언을 먼저 등록해두는 내부 처리 과정

```jsx
console.log(x); // undefined
var x = 10;
```

이게 동작하는 이유는

자바스크립트가 내부적으로 이렇게 바꾸기 때문임

```jsx
var x; // 선언만 먼저 한 상태 (초기화 X)
console.log(x); // undefined
x = 10;
```

이렇게 변수 선언이 먼저 등록돼 있어서 오류가 안나고 `undefined` 로 처리되는것임

<br>

🔥 함수 호이스팅은 또 다름

```jsx
foo(); // 함수 호출 가능
function foo() {
	console.log("hi");
}
```

함수 선언문은 전체 통째로 호이스팅 됨. 그래서 선언 전에 호출해도 문제 없음 ❌

💥 하지만 ! 함수 표현식은 `var bar`만 호이스팅되고(=변수만 호이스팅 됨) 값은 undefined라서 호출 시 에러 발생함

```jsx
bar(); // TypeError
var bar = function () {
	console.log("hello");
}
```

```jsx
foo(); // ReferenceError

const foo = () => {
	console.log("hi");
}
```

`const` 는 호이스팅 되지만 → TDZ가 생김

내부적으로는 이렇게 처리됨

```jsx
// 선언 (호이스팅 OK)
const foo; // 아직 초기화 전 -> TDZ에 있음

foo(); // 여기서 ReferenceError 발생

foo = () => {
	console.log("hi");
}
```

---



## ⭐ const는 진짜 불변?

```jsx
const obj = { name: "망고" };
obj.name = "사과"; // 가능 !

obj = { name: "딸기" }; // TypeError
```

📍 **const는 변수 자체의 재할당을 막는 것.** 그 안에 든 객체나 배열은 바꿀 수 있음 → 얕은 불변성

<br>

## ⭐ var 은 왜 비추천?

- 스코프가 널널해서 실수가 잦음
- 재선언 가능해서 변수 오염 가능성이 높음
- 호이스팅 + undefined 때문에 버그 찾기 어려움
