const n=`---
title: Jenkins 연동
menu: keycloak
date: 2025-06-23
tags:
- Keycloak
- Jenkins
---

# 🚀 Keycloak

## ⭐ 설치

1. https://www.keycloak.org/downloads : 해당 가이드에서 사용한 버전 **24.0.5**

<br>

## ⭐ Client 생성

1. \`http://<keycloak-url>:<keycloak-port>\` 접속 : 기본 포트 8080으로 설정됨.
2. admin 계정 생성 후 로그인
3. Create realm > realm 생성
4. 생성한 realm > Clients > Create Client
5. Client 정보 입력

![](https://velog.velcdn.com/images/doeezy/post/9b60bdad-4002-46f8-b934-038dab5c520a/image.png)


- ROOT URL : jenkins url
- HOME URL : jenkins url
- Valid redirect URIs: 인증 완료 후 리다이렉트 URL

<br>

## ⭐ Client Scopes 수정

1. Clients scopes > [ roles ]> [ realm roles ]
2. Add to ID token, Add to userinfo 활성화

![](https://velog.velcdn.com/images/doeezy/post/41f0fbcc-ba57-4a4b-804d-33b57e2dd9e1/image.png)


<br>

## ⭐ User에게 Role 부여

1. **Users 메뉴**
2. User 선택 > Role mapping >[Assign role] > Filter by realm roles에서 부여할 role 선택

<br>
<br>

# 🚀 Jenkins
---

## ⭐ 설치

1. https://www.jenkins.io/download/ : 해당 가이드에서 사용한 버전 **2.462.2**
2. 다운로드 시 설정한 port로 접근
3. admin 계정 생성 후 로그인

<br>


## ⭐ 설정

### ✅ **[ Dashboard > Jenkins 관리 > Plugins ]**

Available plugins 탭에서 plugins 검색 후 다운로드

1. **Role-based Authorization Strategy**
2. **OpenId Connect Authentication**

다운로드 후 Jenkins 재시작
<br>

### ✅ **[ Dashboard > Jenkins 관리 > System > Jenkins Location ]**

Jenkins URL이 설치한 서버로 되어있는지 확인

![](https://velog.velcdn.com/images/doeezy/post/39861f13-23a3-4acc-987f-f9a8bddc0414/image.png)


<br>

### ✅ **[ Dashboard > Jenkins 관리 > Security > Authentication ]**

1. **Security Realm**: Login with Openid Connect
  1. **Client id:** Clients > [Client] > Settings > Client ID
  2. **Client secret**: Clients > [Client] > Credentials > Client Secret

![](https://velog.velcdn.com/images/doeezy/post/189ea555-580f-4e63-90ea-16466e3ed9cc/image.png)


2. **Configuration Mode :** Manual entry
  1. **Token server url:** token_endpoint
  2. **issuer:** issuer
  3. **Authrization server url:** authrization_endpoint
  4. **UserInfo server url:** userinfo_endpoint
  5. **Jwks server url:** jwks_uri
  6. **End session URL for OpenID Provider:** end_session_endpoint
  7. **Scopes:** openid email profile

![](https://velog.velcdn.com/images/doeezy/post/a9800098-1965-4312-af37-3e21cd734c9e/image.png)

📍 Keycloak > Realm settings > General > Endpoints > OpenID Endpoint Configuration에서 value 확인

![](https://velog.velcdn.com/images/doeezy/post/c89c14f0-a23f-41e6-ad61-bed02fd82b62/image.png)


1. **Advanced configuration**
  1. **User fields**
    1. **User name field name:** user name token claim name
    2. **User name field name:** Full name token claim name
    3. **Email field name:** email token claim name
    4. **Groups field name:** Client scopes 에서 수정했던 realm roles의 token claim name
  2. **Logout from OpenID Provider** 활성화
  3. **Post logout redirect URL:** jenkins URL || logout 후 리다이렉트 될 URL

![](https://velog.velcdn.com/images/doeezy/post/89323d8e-5c6f-44c7-972d-741b760781fa/image.png)


2. **Authorization:** Role-Based Strategy 선택

![](https://velog.velcdn.com/images/doeezy/post/dd2490e8-c224-4996-8a44-1f2a91c22217/image.png)


1. **입력 사항 저장**
2. **Dashboard > Jenkins 관리 >Assign Roles**
  1. [ Add Group ] > access-jenkins 생성 후 admin 권한 부여

![](https://velog.velcdn.com/images/doeezy/post/5d5531f7-4f3b-4f0f-9bfc-33dd5d208c40/image.png)



# 🚀 테스트
---

1. Jenkins 로그아웃 후 Jenkins 접근 시 Keycloak 로그인 페이지로 리다이렉트 되는 것을 확인할 수 있음.
2. access-jenkins role을 부여한 사용자의 접근 확인
3. access-jenkins role을 부여 받지 못한 사용자의 접근 확인
`;export{n as default};
