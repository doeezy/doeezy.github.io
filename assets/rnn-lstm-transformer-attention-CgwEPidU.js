const n=`---
title: "RNN, LSTM, Transformer, Attention"
menu: ai-llm
date: 2026-02-11
tags:
  - RNN
  - LSTM
  - Transformer
  - Attention
  - LLM
---

[목차]<br/>
- [🍅 RNN, LSTM, Tranformer](#rnn-lstm-transformer)<br/>
  - [RNN](#rnn)
  - [LSTM](#lstm-rnn-업그레이드)
  - [Transformer](#transformer)
  - [요약](#summary)
- [🍅 Attention](#attention-title)
  - [Attention Score](#attention-score)
  - [Self-Attention](#self-attention)

<h1 id="rnn-lstm-transformer">🍅 RNN, LSTM, Transformer</h1>

🤷🏾‍♀️ 어디에 쓰이는 애들임?

RNN, LSTM, Transformer는 전부 **순서가 있는 데이터를 다루는 모델**임

- **RNN/LSTM**: 글을 **한 글자씩 순서대로** 읽는 방식
- **Transformer**: 글을 **한 번에 다 펼쳐놓고 관계를 봄**

<br/>

**1️⃣  텍스트 / 언어**

- 문장 이해
- 번역
- 요약
- 챗봇

과거에는

**RNN / LSTM** : 번역, 감성 분석

**Transformer**: GPT, 번역기, 요약 모델 전부

<br/>

**2️⃣ 음성**

- 음성 인식
- 음성 → 텍스트
- 음성 합성

음성은

- 시간에 따라 파형이 변하고
- 앞 소리가 뒤 의미에 영향을 줌

따라서 순서 모델이 필요하다

<br/>

**3️⃣ 시계열 데이터**

- 주가
- 센서 데이터
- 서버 트래픽
- 사용자 행동 로그

→ “이 패턴 다음에 뭐가 올까?”

<br/>

4️⃣ **이벤트/행동 시퀀스**

- 사용자가 앱에서 누른 버튼 흐름
- 게임 플레이 로그
- 추천 시스템의 행동 이력

<br/>

---

<br/>

\`\`\`json
"철수는 영희에게 책을 줬다. 그래서 **그는** 기뻤다."
\`\`\`

→ 여기서 “**그는”**이 누구냐?

### RNN

🪓 **방식**

- 단어를 **왼쪽 → 오른쪽으로 하나씩** 읽음
- 앞에서 읽은 내용을 **”기억”**이라고 들고 감

💥 **문제**

- 문장이 길어질수록 **앞 내용 기억이 흐려짐**
- 직렬 처리

→ “그는” 까지 왔을 때 “철수”에 대한 기억이 희미해질 수 있음

### LSTM (RNN 업그레이드)

🔨 **개선점**

- 중요한 정보는 오래 기억
- 중요하지 않은 기억은 버림(**게이트**라는 장치 사용)

그래서 RNN 보단 똑똑함

하지만 여전히:

- 순서대로 처리
- 느림
- 문장 길면 한계 있음
- 여전히 **한 줄로 읽음**

### Transformer

🧠 **완전히 다른 발상**

- 문장을 **처음부터 끝까지 한 번에 펼침**
- 모든 단어가 **서로를 동시에 바라봄**
- “그는”이 나오면?
    - 철수?
    - 영희?
    - 둘 다 비교함

이걸 가능하게 하는 건 **Attention임**

<h3 id="summary">🥫 요약</h3>

**RNN / LSTM**

- 순서대로 읽음
- 기억에 의존
- 느리고 길이에 약함

**Transformer**

- 한 번에 다 봄
- Attention으로 관계 계산
- 빠르고 긴 문장에 강함

<br/>

<h1 id="attention-title">🍅 Attention</h1>

Attention을 한 문장으로 표현하면

> 이 단어를 이해할 때, 다른 단어들 중 **누가 얼마나 중요한지** 점수를 매긴다
> 

Attention은 단어 간의 중요도를 계산한다.

### Attention이 필요했던 이유

RNN/LSTM은

- 앞에서 본 걸 “기억” 하려고 애씀
- 기억이 길어질수록 흐려짐

Transformer는 생각을 바꿈

- 기억하지 말고, **필요할 때 다시 보자**

→ 이게 Attention

---

Attention은 사람 처럼 이해함

\`\`\`json
"철수는 영희에게 책을 줬다. 그래서 **그는** 기뻤다."
\`\`\`

사람은 이런 흐름으로 이해함

- “그는”을 보면
- 문장 전체를 다시 훑음
- 철수 / 영희 중 **누가 더 자연스러운지** 판단

Attention도 사람과 동일하게 한다.

---

### Attention Score

각 단어가 이런 질문을 던짐

- “나 이해하려면, 다른 단어들 중 **누굴 얼마나 참고해야하지?**”
- 

📍 ”그는” → “철수”에 높은 점수

📍 ”에게”, “줬다” → 낮은 점수

이 점수들이 **Attention score**

---

### Self-Attention

**Self = 같은 문장 안에서**

- 단어 A가
- 같은 문장에 있는 단어 B, C, D를 바라봄

**즉, 모든 단어가 모든 단어를 봄**

그래서

- 멀리 떨어진 단어도 바로 연결이 가능함
- 문장이 길어져도 관계가 유지됨

그래서 Transformer는

- 모든 단어를 **동시에 Attention 계산**
- 병렬 처리 가능 (GPU 친화)
- 긴 문장도 잘 이해
- 병렬 처리 가능 (GPU 친화)
- 문맥 파악이 압도적으로 좋음`;export{n as default};
