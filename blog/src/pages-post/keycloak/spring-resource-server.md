---
title: Spring Resource Server 연동
menu: keycloak
date: 2025-06-23
tags:
- Keycloak
- Spring-boot
---

Keycloak을 권한 서버(Authorization Server)로 사용하고, Spring Boot 애플리케이션을 OAuth2 기반 Resource Server로 구성하는 방법

JWT 및 Qpaque(불투명) 토큰 방식 모두 다룸

<br>
<br>


# 🚀 개념 요약

## ⭐Resource Server

- OAuth2에서 리소스 서버는 보호된 API를 제공하는 쪽
- 클라이언트가 API를 호출할 때, BGearer 토큰을 전달
- 리소스 서버는 토큰을 검증하고 유효하면 리소스 제공


## ⭐ JWT vs Opaque Token(불투명 토큰)

| 항목 | JWT | Opaque Token |
| --- | --- | --- |
| 형태 | 서명된 JSON | 식별자 문자열 (정보 없음) |
| 검증 | 서명 검증으로 자체 처리 | 권한 서버에 introspection(내부 검증) 요청 |
| 장점 | 빠르고 탈중앙화 검증 가능 | 서버 제어/철회 용이 |
| 단점 | 토큰 노출 위험, 만료 전 폐기 어려움 | 매 요청마다 introspection 비용 발생 |

<br>

---

<br>

# 🚀 시뮬레이션

## ⭐ 권한 서버 (Keycloak)

- 토큰 발급을 위한 권한 서버 설정
- Spring Boot 애플리케이션에 내장된 Keycloak을 사용
- 테스트를 위해 두 개의 클라이언트 등록
  - `fooClient` : JWT 토큰 기반 리소스 서버용
  - `barClient` : Opaque 토큰 기반 리소스 서버용

<br>

## 🔥 리소스 서버 - JWT 방식

다음의 네 가지 주요 구성 요소로 이루어짐

- 모델 : 보호할 Resource
- API : Resource를 노출하는 REST Controller
- 보안 구성 : API에서 노출된 보호된 Resource에 대한 접근 제어를 정의하는 Class
- application.yml : 권한 서버에 대한 정보를 포함하는 설정 파일

### 📦 필요 의존성 (Maven)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```
> Spring Security 포함됨


### 📦 Model

간단하게, `Foo`라는 POJO(Plain Old Java Object)를 보호된 Resource로사용

```java
public class Foo {
    private long id;
    private String name;
}
```

### 📦 Security Configuration

리소스에 대한 접근 수준 정의

```java
@Configuration
public class JWTSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests(authz -> authz
		        .requestMatchers(HttpMethod.GET, "/foos/**").hasAuthority("SCOPE_read")
            .requestMatchers(HttpMethod.POST, "/foos").hasAuthority("SCOPE_write")
            .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

- `read` 범위(scope)를 가진 액세스 토큰을 가진 사람은 누구나 `Foo` 객체 조회 가능
- 새로운 `Foo` 객체를 생성하려면 토큰에 `write` 범위가 있어야 함.
- `oauth2ResourceServer()` 를 사용하여 토큰 타입이 `jwt()`임을 명시

### 📦 Controller

`Foo` 객체를 조작할 수 있도록 제공하는 REST Controller

```java
@RestController
@RequestMapping(value = "/foos")
public class FooController {

    @GetMapping(value = "/{id}")
    public Foo findOne(@PathVariable Long id) {
        return new Foo(Long.parseLong(randomNumeric(2)), randomAlphabetic(4));
    }

    @GetMapping
    public List findAll() {
        List fooList = new ArrayList();
        fooList.add(new Foo(Long.parseLong(randomNumeric(2)), randomAlphabetic(4)));
        fooList.add(new Foo(Long.parseLong(randomNumeric(2)), randomAlphabetic(4)));
        fooList.add(new Foo(Long.parseLong(randomNumeric(2)), randomAlphabetic(4)));
        return fooList;
    }

	  @PostMapping
    public ResponseEntity<?> create(@RequestBody Foo foo) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
```

### 📦 application.yml

```yaml
server:
  port: 8081
  servlet:
    context-path: /resource-server-jwt

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8083/auth/realms/myrealm
```

- `issuer-uri` : Keycloak의 Realm에 해당하는 URI (메타데이터 자동 로딩)
- 필요 시 `jwt-set-uri`로 공개키 직접 지정 가능

```yaml
jwk-set-uri: http://localhost:8083/auth/realms/myrealm/protocol/openid-connect/certs
```

<br>
<br>

## 🔥 리소스 서버 - Opaque 방식

### 📦 필요 의존성(Maven)

```xml
<dependency>
  <groupId>com.nimbusds</groupId>
  <artifactId>oauth2-oidc-sdk</artifactId>
  <version>8.19</version>
</dependency>

```

### 📦 Model 과 Controller는 `Foo`와 동일하게 작성

```java
public class Bar {
    private long id;
    private String name;
}
```

### 📦 Security Configuration

리소스에 대한 접근 수준 정의

```java
@Configuration
public class OpaqueSecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.opaque.introspection-uri}")
    String introspectionUri;

    @Value("${spring.security.oauth2.resourceserver.opaque.introspection-client-id}")
    String clientId;

    @Value("${spring.security.oauth2.resourceserver.opaque.introspection-client-secret}")
    String clientSecret;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests(authz -> authz.requestMatchers(HttpMethod.GET, "/foos/**").hasAuthority("SCOPE_read")
            .requestMatchers(HttpMethod.POST, "/foos").hasAuthority("SCOPE_write")
            .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.opaqueToken
                (token -> token.introspectionUri(this.introspectionUri)
                .introspectionClientCredentials(this.clientId, this.clientSecret)));
        return http.build();
    }
}
```

- 접근 구성은 `Foo` 와 동일하게 작성
- `oauth2ResourceServer()` 를 사용하여 토큰 타입이 **`opaqueToken()`**임을 명시

### 📦 application.yml

```yaml
server:
  port: 8082
  servlet:
    context-path: /resource-server-opaque

spring:
  security:
    oauth2:
      resourceserver:
        opaque:
          introspection-uri: http://localhost:8083/auth/realms/myrealm/protocol/openid-connect/token/introspect
          introspection-client-id: barClient
          introspection-client-secret: barClientSecret
```

- Authorization Server의 introspection 엔드 포인트와 연결된 `introspection-uri`를 추가
- 불투명 토큰은 이 `introspection-uri`를 통해 검증됨
