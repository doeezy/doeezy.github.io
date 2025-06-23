const n=`---
title: store(Pinia)
menu: vuejs
date: 2025-01-01
tags:
- Vue.js
- Vue3
- frontend
---

# 🔍 기본

\`\`\`jsx
import { defineStore } from 'pinia'

// \`defineStore()\`의 반환 값(함수)을 할당할 변수의 이름은 원하는 대로 지정할 수 있지만,
// 스토어 이름을 사용하고 \`use\`와 \`Store\`로 묶는 것이 가장 좋습니다.
// 예: \`useUserStore\`, \`useCartStore\`, \`useProductStore\`
// 첫 번째 인자는 앱 전체에서 스토어의 고유 ID입니다.
export const useAlertsStore = defineStore('alerts', {
  // 다른 옵션...
})
\`\`\`

***첫 번째 인자***로 ID라고도 하는 **NAME이 필요**하며 피니아에서 스토어와 devtools를 연결하는데 사용한다.

함수 이름을 use…로 지정하는 것은 관용적으로 만들기 위한 컴포저블 전반에 걸친 규칙이다.

***두 번째 인자***로는 **셋업 함수** 또는 **옵션 객체**를 허용한다.

---

# 🔍 옵션 스토어

\`\`\`jsx
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
\`\`\`

- **state** : store의 data
- **getters** : store의 computed 속성
- **actions**: store의 methods

---

# 🔍 셋업 스토어

\`\`\`jsx
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
// 모든 상태 속성을 반환해야 함
  * **return { count, name, doubleCount, increment }**
})
\`\`\`

- **ref()** : state 속성
- **computed()** : getters
- **functions()** : actions

✅ Pinia가 상태로 인식하게 하려면 셋업 스토어에서 **모든 상태 속성을 반환**해야 한다.

모든 상태 속성을 반환하지 않으면 SSR, devtools 및 기타 플러그인이 손상될 수 있다.

셋업 스토어는 옵션 스토어보다 훨씬 더 유연성을 제공한다. 저장소 내에서 **watcher를 생성**하고 모든 **composable을 사용**할 수 있다. 그러나 SSR을 사용할 때 composables 사용이 더 복잡해질 수 있다.

셋업 스토어는 또한 **Router나 Route와 같은 전역 속성에 의존**할 수 있다. **앱 수준에서 제공된 어떠한 속성**이라도 **inject()**를 사용하여 스토어에서 접근할 수 있다.

\`\`\`jsx
import { inject } from 'vue'
import { useRoute } from 'vue-router'

export const useSearchFilters = defineStore('search-filters', () => {
  **const route = useRoute()**
  // 이것은 \`app.provide('appProvided', 'value')\`가 호출되었다고 가정함
  **const appProvided = inject('appProvided')**

  // ...
  return {
    // ...
  }
})
\`\`\`

---

# 🔍 스토어 사용

\`<script setup>\` 구성요소 내에서 use…Store()가 호출될 때 까지 스토어가 생성되지 않으므로 스토어를 정의해준다.

\`\`\`jsx
<script setup>
**import { useCounterStore } from '@/stores/counter'**

// 컴포넌트 어디에서나 \`store\` 변수에 액세스
const **store** = useCounterStore()
<\/script>
\`\`\`

스토어가 인스턴스화되면 스토어에서 직접 state, getters, actions에 정의된 모든 속성에 접근이 가능하다.

store는 reactive로 래핑된 객체이다. 즉 getter 뒤에 .value를 쓸 필요가 없지만 setup의 props와 같이 구조화할 수 없다.

\`\`\`jsx
<script setup>
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
// ❌ 반응성을 깨뜨리기 때문에 작동하지 않습니다.
// \`props\`에서 디스트럭처링하는 것과 동일합니다.
**const { name, doubleCount } = store
name // 언제나 "Eduardo"
doubleCount // 언제나 0**

setTimeout(() => {
  store.increment()
}, 1000)

// ✅ 이것은 반응적일 것입니다
// 💡 또한 \`store.doubleCount\`로 직접 사용할 수도 있습니다.
**const doubleValue = computed(() => store.doubleCount)**
<\/script>
\`\`\`

---

# 🔍 저장소에서 드스트럭처링(비구조화)

반응형을 유지하면서 스토어에서 속성을 추출하려면, **storeRefs()**를 사용해야한다. 이것은 스토어의 상태만 사용하고 액션을 호출하지 않을 때 유용하다. 스토어 자체에도 바인딩 되므로 스토어에서 직접 액션을 구조화할 수 있다.

\`\`\`jsx
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
// \`name\`과 \`doubleCount\`는 반응형 refs임.
// 이것은 플러그인에 의해 추가된 속성에 대한 'refs'도 추출함.
// 그러나 모든 액션 또는 비반응형(ref/반응형이 아닌) 속성을 건너뜀.
**const { name, doubleCount } = storeToRefs(store)**
// increment 액션은 그냥 구조화 가능.
const { increment } = store
<\/script>
\`\`\`

---

# 🔍 Options API 에서의 Pinia 스토어 사용

아직 setup 컴포넌트를 사용하지 않는 경우에는 “맵 헬퍼”로 피니아를 사용할 수 있다.

\`\`\`jsx
import { mapStores } from 'pinia'

// 다음과 같은 ID를 가진 두 개의 스토어가 있다고 가정합니다.
const useUserStore = defineStore('**user**', {
  // ...
})
const useCartStore = defineStore('**cart**', {
  // ...
})

export default {
  computed: {
    // 배열을 전달하지 않고, 스토어를 하나씩 전달합니다.
    // **각 스토어는 ID 뒤에 'Store'를 붙여서 액세스할 수 있습니다.**
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // 어디서든 사용할 수 있습니다!
      if (this.userStore.isAuthenticated()) {
        await this.**cartStore**.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
\`\`\`

기본적으로 Pinia는 각 스토어의 id에 “Store” 접미사를 추가한다.

접미사는 setMapStoreSuffix()를 호출하여 사용자가 정의할 수 있다.

\`\`\`jsx
import { createPinia, setMapStoreSuffix } from 'pinia'

// 접미사를 완전히 제거합니다: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store
setMapStoreSuffix('_store')
export const pinia = createPinia()
\`\`\`

TypeScript를 사용하는 경우에 접미사를 변경했다면 TS파일이나 global.d.ts파일에 해당 접미사를 추가해야한다. typescript 선언 파일(global.d.ts 등)을 사용하는 경우, 최상단에 import ‘pinia’를 추가해야 한다.

\`\`\`jsx
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // 접미사를 완전히 제거합니다.
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // 위와 동일한 값으로 설정하세요.
    suffix: ''
  }
}
\`\`\`
`;export{n as default};
