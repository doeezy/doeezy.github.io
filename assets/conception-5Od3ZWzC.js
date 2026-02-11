const n=`---
title: 기본 개념과 주요 Authentication Flow
menu: keycloak
date: 2025-06-23
tags:
- Keycloak
- SSO
- OAuth2
---

ID 및 액세스 관리 솔루션을 제공하는 오픈소스.

- 인증(Authentication)과 인가(Authorization)을 쉽게 처리할 수 있도록 도와줌
- OAuth2.0 및 OpenID Connect(OIDC) 기반으로 작동함
- SSO를 기본적으로 제공하며 다양한 클라이언트와 연동 가능

<br>
<br>

## 🚀 Keycloak의 주요 Authentication Flow 종류
<br>

### ⭐ Authorization Code Flow (권장)

- OAuth 2.0 및 OpenID Connect에서 가장 많이 사용되는 흐름
- 보안성 매우 높음 (PKCE도 함께 사용 가능)
- 📌 Access Tokend을 직접 전달하지 않고 인증 코드(Authorization Code)를 통해 토큰을 얻는 방식
- 📌 서버 사이드 웹 어플리케이션 or 프론트엔드-백엔드 분리 구조에 적합한 인증 방식
  <br>

### 🔥 특징

- 브라우저에 Token이 직접 노출되지 않아 보안성 높음
- 다양한 보안 정책 (PKCE, scope 제한, 세션 제어) 적용 가능
- 사용자 인증 후 클라이언트는 Access Token을 이용해 보호된 Resource에 접근
  <br>

### 🔥 Process Flow

1. 사용자가 클라이언트 앱에 접근
2. 클라이언트가 Keycloak에 인증 요청
  1. 다음과 같은 정보가 포함된 인증 요청
    1. \`client_id\`
    2. \`redirect_uri\`
    3. \`response_type\`=code > 인증 코드 방식임을 나타냄
    4. \`scope\` > 요청된 권한 범위 (예: openid, profile, email)
3. Keycloak 로그인 페이지로 리디렉션 → 사용자 로그인
4. 인증 성공 시, \`redirect_uri\`로 Authorization Code를 포함해 리디렉션
5. 클라이언트는 해당 Code를 가지고 Keycloak 토큰 엔드포인트에 Access Token 요청
6. Keycloak이 Access Token + (선택) Refresh Token 발급

\`\`\`sql
+-------------------+       +----------------------+       +---------------------+
|      User         |       |     Client (App)      |       | Authorization Server |
+-------------------+       +----------------------+       +---------------------+
        |                              |                              |
        | 1. Access Resource Request    |                              |
        |----------------------------->|                              |
        |                              |                              |
        |                              | 2. Request Authorization Code |
        |                              |----------------------------->|
        |                              |                              |
        |                              |    3. Login Prompt to User    |
        |<-------------------------------------------------------------|
        | 4. User Logs in              |                              |
        |----------------------------->|                              |
        |                              |    5. Return Authorization    |
        |                              |<-----------------------------|
        |                              |    Code                       |
        |                              |                              |
        |                              | 6. Exchange Auth Code for     |
        |                              |    Access Token               |
        |                              |----------------------------->|
        |                              |                              |
        |                              | 7. Return Access Token        |
        |                              |<-----------------------------|

\`\`\`

<br>
<br>

## ⭐ Implicit Flow (⚠️현재 권장되지 않음)

- 클라이언트(브라우저)에서 직접 Access Token을 받는 방식
- 보안 위험이 커서 OIDC에서 더 이상 권장하지 않음 ❌
- SPA 등 에서 사용.
  <br>

### 🔥 Process Flow

1. 클라이언트는 Access Token 을 요청하기 위해 Keycloak에 리디렉션
2. 사용자 인증 성공 시, 즉시 Access Token 을 클라이언트에게 전달

\`\`\`sql
+-------------------+       +----------------------+       +---------------------+
|      User         |       |     Client (App)      |       | Authorization Server |
+-------------------+       +----------------------+       +---------------------+
        |                              |                              |
        | 1. Access Resource Request    |                              |
        |----------------------------->|                              |
        |                              | 2. Request Access Token       |
        |                              |----------------------------->|
        |                              |                              |
        |                              |    3. Login Prompt to User    |
        |<-------------------------------------------------------------|
        | 4. User Logs in              |                              |
        |----------------------------->|                              |
        |                              | 5. Return Access Token        |
        |                              |<-----------------------------|

\`\`\`

<br>
<br>

## ⭐ Client Credentials Flow

- 사용자 인증이 필요 없는 서버 대 서버 통신에 적합한 방식 > 사용자 대신 앱이나 서비스 계정끼리 동작할 때 적합
- 마이크로서비스, 백엔드 API 간 인증에 많이 사용됨
- 클라이언트 앱에 자체적으로 Keycloak에 인증하여 Access Token 을 얻음
  <br>

### 🔥 Process Flow

1. 클라이언트 애플리케이션이 Keycloak에 인증 요청.
2. 인증이 완료되면 Access Token 발급.

\`\`\`sql
+-------------------+       +----------------------+       +---------------------+
|                   |       |     Client (App)      |       | Authorization Server |
|                   |       +----------------------+       +---------------------+
|                   |                              |                              |
|                   | 1. Request Access Token      |                              |
|                   |----------------------------->|                              |
|                   |                              | 2. Validate Client           |
|                   |                              |    Credentials               |
|                   |                              |----------------------------->|
|                   |                              | 3. Return Access Token       |
|                   |                              |<-----------------------------|

\`\`\`

<br>
<br>

## ⭐ Resource Owner Password Credentials Flow (ROPC)

- 클라이언트에서 사용자의 ID/PW를 직접 받아 Keycloak에 인증 요청
- ⚠️ 보안 위험이 커서 신뢰 가능한 환경 외에는 사용 비추천
  <br>

### 🔥 Process Flow

1. 사용자가 클라이언트 앱에서 ID와 비밀번호 입력
2. 클라이언트 앱이 Keycloak에 해당 자격 증명을 사용하여 Access Token 요청
3. Access Token 발급

\`\`\`sql
+-------------------+       +----------------------+       +---------------------+
|      User         |       |     Client (App)      |       | Authorization Server |
+-------------------+       +----------------------+       +---------------------+
        |                              |                              |
        | 1. Submit Credentials         |                              |
        |----------------------------->|                              |
        |                              | 2. Forward Credentials        |
        |                              |----------------------------->|
        |                              |                              |
        |                              |    3. Validate User           |
        |                              |    Credentials                |
        |                              |----------------------------->|
        |                              |    4. Return Access Token     |
        |                              |<-----------------------------|

\`\`\`

<br>
<br>

## ⭐ Device Authorization Flow

- 키보드/브라우저 없는 디바이스 (TV, IoT 등) 에 적합한 인증 방식
- 사용자에게 인증 코드를 주고 다른 기기에서 인증을 수행함

<br>

### 🔥 Process Flow

1. 디바이스가 Keycloak에 인증 요청
2. Keycloak이 사용자에게 특정 코드를 제공
3. 사용자는 브라우저에서 코드를 입력하고 인증을 완료
4. 디바이스가 Access Token을 발급 받음.

\`\`\`sql
+-------------------+       +----------------------+       +---------------------+
|     Device        |       |     Client (App)      |       | Authorization Server |
+-------------------+       +----------------------+       +---------------------+
        |                              |                              |
        | 1. Request Authorization     |                              |
        |----------------------------->|                              |
        |                              | 2. Return Device Code & User  |
        |                              |    Code                       |
        |<-----------------------------|                              |
        |                              |                              |
        | 3. User enters User Code on   |                              |
        |    a different device         |                              |
        |----------------------------->|                              |
        |                              | 4. User Authenticates         |
        |                              |----------------------------->|
        |                              |    5. Return Access Token     |
        |                              |<-----------------------------|
        | 6. Use Access Token to        |                              |
        |    access resources           |                              |

\`\`\`

<br>
<br>

## 🚀 Client 설정 시 주의점

<br>

### ⭐ \`Access Type\`

- confidential: 서버 사이드 앱 용, client secret 필요
- public: SPA나 모바일 앱용, 시크릿 없음
- bearer-only: 토큰만 받고 직접 로그인은 안함 (API 서버용)

⚠️Keycloak v22~ 부터는 Access Type을 직접 설정하는 대신 조합으로 대신함

- public > \`Client Authentication = OFF\`
- confidential > \`Client Authentication = ON\` + \`Service Accounts Enabled = OFF\`
- bearer-only > \`Client Authentication = ON\` + \`Standard Flow Enabled = OFF\` + \`Direct Access Grants Enabled = OFF\`

## 🔥 핵심 설정

- **Client authentication**:
  - \`ON\`이면 confidential처럼 작동 (시크릿 필요)
  - \`OFF\`면 public처럼 작동
- **Standard Flow Enabled**:
  - Authorization Code Flow (브라우저 인증) 허용 여부
- **Direct Access Grants Enabled**:
  - ROPC(사용자 ID/PW 직접 제출) 허용 여부
- **Service Accounts Enabled**:
  - Client Credentials Flow (서버-서버 통신) 허용 여부

<br>
<br>

### ⭐ \`Valid Redirect URIs\`

반드시 명확하게 지정해야 함. 와일드 카드(\`*\`)는 최소화

<br>
<br>


### ⭐ \`Web Origins\`

CORS 에러 방지를 위해 클라이언트 도메인 명시해야 함

<br>
<br>


## 🚀 OIDC Discovery Endpoint

클라이언트 앱은 Keycloak의 \`.well-known\` URL을 통해 자동 설정 가능

(ex) \`https://{host}/realms/{realm}/.well-known/openid-configuration\`

<br>
<br>

## 🚀 Client Scope / Mapper

- 사용자의 속성(email, username 등)을 토큰에 포함시키기 위한 설정
- \`ID Token\` / \`Access Token\`에 클레임 추가하려면 꼭 설정해야함
`;export{n as default};
