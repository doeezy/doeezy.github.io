---
title: 클로저
menu: javascript
date: 2025-01-01
tags:
  - javascript
  - frontend
---

# 🧠 클로저?

함수가 생성될 당시의 외부 변수(스코프)를 기억하고, 그 스코프에 계속 접근할 수 있는 함수

쉽게 말해서 **함수 밖에서 만든 변수를, 함수 안에서 계속 쓸 수 있게 해주는 기술**이라고 할 수 있다.

---

## 📝 기본 예제

```jsx
function outer() {
  const name = "홍길동";

  function inner() {
    console.log("Hello " + name);
  }

  return inner;
}

const greeting = outer(); // 함수 실행 후 없어짐
greeting(); // Hello gildong
```

- `outer()`가 실행되고 끝났는데도(없어졌는데도)
- `inner()`는 `name`을 여전히 기억함

→ 이게 바로 클로저 ! 🚀

클로저는 함수가 **"자기가 만들어질 당시의 스코프"**를 기억하는 기술

<br>


## 🤷🏾‍♀️ 여기서 내가 든 의문

`outer()` 안에서 `inner()` 함수를 선언했고, 그럼 `inner()` 함수는 내부 스코프부터 외부 스코프까지 LexicalEnvironment에 저장하니까 `name`을 기억하고 있는거 아님?

이게 클로저라고????

### 정답은 👊🏾💥

LexicalEnvironment에 저장된 스코프 정보 덕분에 **클로저가 가능** 해지는 것임

다만 LexicalEnvironments는 **함수가 만들어 질 때 정의되는 구조고,**

클로저는 **함수가 실행된 이후에도 그 구조를 계속 “기억하고 있는 상태”**를 말함

자바스크립트는 함수 실행이 끝나면 **함수의 실행 컨텍스트**를 메모리에서 날려버림! 🧹

예를 들어:

```jsx
function outer() {
  const name = "홍길동";
  console.log("outer done");
}

outer(); // 실행되고 끝남
```

→ `outer()` 끝나면 `name`도, outer의 컨텍스트도 **다 날아감**

<br>


## 🤯 근데 어떻게 기억하고 있는거임?

```jsx
function outer() {
  const name = "홍길동";

  function inner() {
    console.log("Hello " + name);
  }

  return inner;
}

const greeting = outer(); // 여기서 outer는 실행 끝났는데
greeting(); // 어떻게 name을 기억하고 있음?
```

- `inner` 함수가 `name`을 사용하고 있어서 JS 엔진이 “이 변수 아직 사용중이네?” 하고 스코프를 메모리에서 안 지우고 계속 보관하고 있음

→ 클로저 덕분에 스코프가 살아있는 상태가 유지되는 것임

---

# 🔥 정리

## 1. 함수는 “정의될 때” LexicalEnvironment를 저장함

```jsx
function outer() {
  const name = "홍길동";
  return function inner() {
    console.log(name);
  };
}
```

→ `inner`는 LexicalEnvironment를 기억하고 있음

→ 이건 함수 객체 자체의 특성으로 생성 시점에 저장됨

## 2. 함수가 “호출되면” 실행 컨텍스트가 생성됨

```jsx
const greeting = outer(); // outer의 실행 컨텍스트 생성됨 → 실행 끝나면 파괴
greeting();               // inner의 실행 컨텍스트가 새로 만들어짐
```

→ `outer()` 호출 → 실행 컨텍스트 생성 → 종료 → 삭제

→ `greeting()`  호출 → `inner`의 새 실행 컨텍스트 생성

## 3. 근데 클로저는 “LexicalEnv를 기억해서” 외부 스코프에 접근 가능함

→ `inner()`는 자기 LexicalEnv에 `outer` 스코프 참조를 가지고 있음

→ 이 참조가 살아있으면 해당 외부 변수도 GC(가비지 컬렉터)가 안 지움

---

## 🔍 클로저가 만들어지는 조건

1. **함수 안에서 또 다른 함수를 리턴하거나 반환할 때**
2. 내부 함수가 외부 함수의 변수에 접근할 때
3. 외부 함수 실행이 끝나도, 내부 함수가 살아있을 때

---

## 🔔 Quiz

❓ Q1. 다음 코드의 출력 결과는?

```jsx
function makeCounter() {
  let count = 0;

  return function () {
    count++;
    console.log(count);
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

counter1(); // ?
counter1(); // ?
counter2(); // ?
```

🙋🏾‍♀️ 1, 2, 1

클로저별 스코프는 분리됨.

```jsx
const counter1 = makeCounter(); // count = 0 (A)
const counter2 = makeCounter(); // count = 0 (B)
```

- `counter1()` → 1
- `counter1()` → 2 (A의 count가 유지됨)
- `counter2()` → 1 (B의 count는 별도 클로저)

<br>

❓ Q2. 다음 코드에서 콘솔에 뭐가 찍힐까?

```jsx
function outer(x) {
  return function inner(y) {
    console.log(x + y);
  };
}

const add5 = outer(5);
add5(3); // ?
add5(10); // ?
```

🙋🏾‍♀️ 8, 15

```jsx
const add5 = outer(5); // x = 5 저장됨
add5(3); // x = 5, y = 3 → 8
add5(10); // x = 5, y = 10 → 15
```

<br>

❓ Q3. 다음 코드의 동작 결과를 설명하시오

```jsx
function wrapper() {
  let secret = "비밀";

  return {
    getSecret: function () {
      return secret;
    },
    setSecret: function (newSecret) {
      secret = newSecret;
    },
  };
}

const safe = wrapper();
console.log(safe.getSecret()); // ?
safe.setSecret("메롱");
console.log(safe.getSecret()); // ?
```

🙋🏾‍♀️ 비밀, 메롱
