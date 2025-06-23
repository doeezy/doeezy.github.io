const r=`---\r
title: 대용량 JSON 파일 요청 API 성능 개선\r
menu: troubleshooting\r
date: 2025-06-16\r
tags:\r
- backend\r
- Java\r
- Spring-Boot\r
- Troubleshooting\r
---\r
\r
## 📦 환경\r
\r
- Spring Boot (Maven 기반)\r
- Java 11\r
- Nuxt3\r
- WAS → JEUS (WAR 배포)\r
\r
---\r
\r
## 🚨 문제 상황\r
\r
- 약 75MB 이상의 대용량 JSON 파일을 API로 전송해야함\r
- 응답에 약 10초 이상 소요됨\r
- 최초 응답 후 Nuxt Store 캐시를 사용하기 때문에 이후 진입은 빠르지만 최초 응답시의 병목이 심각\r
- 매 응답 시마다 디스크에서 \`FileInputStream\` → 응답 스트리밍 하는 구조\r
\r
---\r
\r
## 🔍 원인 분석\r
\r
- 매 요청마다 실시간 디스크 I/O 처리\r
- 브라우저 캐시 미 적용으로 동일한 자원에 대한 요청 반복 발생\r
- 캐싱 처리 안함 → 자원 낭비\r
\r
---\r
\r
# 🚀 트러블슈팅 과정\r
\r
### 🔥 최초 구조\r
\r
\`\`\`jsx\r
new FileInputStream(file)\r
\`\`\`\r
\r
- 요청 시마다 파일 읽고 전송 → 느림 + CPU 부하 + 디스크 I/O 과부하 우려\r
- 퍼포먼스 병목 발생\r
\r
\r
### 🔥 GZIP 압축 처리\r
\r
\`\`\`jsx\r
new FileInputStream(file) + GZIPOutputStream(outputStream)\r
\`\`\`\r
\r
- gzip 압축을 추가하였으나 매 요청마다 파일을 읽고 전송하는것에 변함이 없기 때문에 퍼포먼스가 크게 달라지지 않음\r
\r
<br>\r
\r
### ⭐ 개선 과정 정리\r
\r
📍 운영 환경은 WAS 1대가 이중화 되어있는 구조. WAS의 메모리를 (-Xmx2048m)로 잡아뒀기 때문에 여유가 있으므로 메모리 gzip 캐싱 방식으로 개선함\r
<br>\r
\r
✅ 1. 메모리 gzip 캐싱\r
\r
\`\`\`jsx\r
@PostConstruct\r
public void init() {\r
    reloadCache(); // gzip 후 byte[] 저장\r
}\r
\r
@Scheduled(cron = "0 0 0 * * *") // 자정마다 캐시 업데이트\r
public void reloadCache() { ... }\r
\`\`\`\r
\r
- 앱 시작 시 파일을 byte[]로 gzip 압축 후 메모리에 캐싱\r
- 파일이 매일 자정마다 갱신되므로 자정마다 캐시 업데이트 스케쥴링\r
- 메모리 사용량은 증가하지만 응답 속도가 크게 개선됨 + CPU/디스크 부담 🔽\r
\r
<br>\r
\r
✅ 2. HTTP 브라우저 캐시 헤더 적용\r
\r
\`\`\`jsx\r
headers.setCacheControl("public, max-age=" + cacheSeconds);\r
headers.set("Expires", DateTimeFormatter.RFC_1123_DATE_TIME.format(expiresAt));\r
\`\`\`\r
\r
- 매일 자정까지 브라우저 캐시가 유효하도록 처리\r
- \`Cache-Control\`, \`Expires\` 헤더로 클라이언트 캐시 처리\r
\r
<br>\r
\r
### ⭐ 최종 구조\r
\r
- 파일 처리 → 앱 시작시 GZIP 압축 후 메모리 캐싱\r
- 응답 처리 → byte[] 데이터를 Streaming으로 즉시 전송\r
- 캐시 갱신 → 매일 자정마다 스케쥴링 처리\r
- 브라우저 캐시 추가\r
\r
---\r
\r
## 📄 개선 결과\r
\r
기존은 응답에 약 10초 이상 소요되었음\r
\r
개선 이후 응답에 약 4-5초 소요되어서 응답 시간이 크게 개선됨\r
`;export{r as default};
