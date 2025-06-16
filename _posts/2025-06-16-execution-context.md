---
layout: post
title: Dark Mode
tags: [Katex, Mermaid, Markdown]
categories: Demo
---

코드를 짜면

# ✅ 정의

자바스크립트 코드가 실행되는 환경(컨텍스트)에 대한 정보를 담는 객체

# ✅ 생성 시기

JS 코드를 실행할 때

- 전역 코드 실행 시 → 전역 실행 컨텍스트
- 함수 호출 시 → 함수 실행 컨텍스트
- (드물지만) eval() 사용 시 → eval 실행 컨텍스트

컨텍스트는 `콜 스택`에 쌓여서 가장 최근 실행 컨텍스트부터 실행됨(LIFO 구조)

# ✅ 구성 요소

| 구성 요소               | 설명                                            |
| ----------------------- | ----------------------------------------------- |
| **LexicalEnvironment**  | 변수, 함수, 스코프 정보                         |
| **VariableEnvironment** | `var` 선언 등을 위한 환경 (보통 Lexical과 동일) |
| **ThisBinding**         | 해당 컨텍스트에서의 `this` 값                   |

※ **LexicalEnvironment는 함수 클로저, 스코프 체인과 직결됨**

# ✅ 실행 단계

## 1️⃣ 생성 단계 (Creation Phase)

- `var` → `undefined` 로 메모리 공간 확보
- `let`, `const` → **TDZ**(Temporal Dead Zone) 설정됨 (초기화X)
- 함수 선언 → 전체 함수가 메모리에 등록됨
- `this` 바인딩 설정

## 2️⃣ 실행 단계 (Execution Phase)

- 변수에 값 할당
- 함수 실행
- 참조 연산 등 처리

# ✅ 흐름 예시

```jsx
function foo() {
  console.log(a); // undefined
  var a = 10;
}
foo();
```

**실행 컨텍스트 흐름:**

1. 전역 컨텍스트 생성 → `foo` 함수 선언 등록됨
2. `foo()` 실행 → **함수 컨텍스트 생성**
3. 함수 컨텍스트 생성 단계 → `a`를 `undefined`로 메모리 할당
4. 실행 단계 → `console.log(a)`실행 → `undefined` 출력
5. 이후 `a = 10` 할당됨

# ✅ 시각적 이해 (콜 스택)

```
CALL STACK
────────────
| foo EC   | ← 함수 실행 중
| globalEC | ← 전역 실행 컨텍스트
────────────
```

함수 실행 끝나면 `foo EC`는 스택에서 **pop됨**
