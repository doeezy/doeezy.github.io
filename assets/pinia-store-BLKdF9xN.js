const r=`---\r
title: store(Pinia)\r
menu: vuejs\r
date: 2025-01-01\r
tags:\r
- Vue.js\r
- Vue3\r
- frontend\r
---\r
\r
## 🔍 기본\r
\r
\`\`\`jsx\r
import { defineStore } from 'pinia'\r
\r
// \`defineStore()\`의 반환 값(함수)을 할당할 변수의 이름은 원하는 대로 지정할 수 있지만,\r
// 스토어 이름을 사용하고 \`use\`와 \`Store\`로 묶는 것이 가장 좋습니다.\r
// 예: \`useUserStore\`, \`useCartStore\`, \`useProductStore\`\r
// 첫 번째 인자는 앱 전체에서 스토어의 고유 ID입니다.\r
export const useAlertsStore = defineStore('alerts', {\r
  // 다른 옵션...\r
})\r
\`\`\`\r
\r
***첫 번째 인자***로 ID라고도 하는 **NAME이 필요**하며 피니아에서 스토어와 devtools를 연결하는데 사용한다.\r
\r
함수 이름을 use…로 지정하는 것은 관용적으로 만들기 위한 컴포저블 전반에 걸친 규칙이다.\r
\r
***두 번째 인자***로는 **셋업 함수** 또는 **옵션 객체**를 허용한다.\r
\r
---\r
\r
## 🔍 옵션 스토어\r
\r
\`\`\`jsx\r
export const useCounterStore = defineStore('counter', {\r
  state: () => ({ count: 0, name: 'Eduardo' }),\r
  getters: {\r
    doubleCount: (state) => state.count * 2,\r
  },\r
  actions: {\r
    increment() {\r
      this.count++\r
    },\r
  },\r
})\r
\`\`\`\r
\r
- **state** : store의 data\r
- **getters** : store의 computed 속성\r
- **actions**: store의 methods\r
\r
---\r
\r
## 🔍 셋업 스토어\r
\r
\`\`\`jsx\r
export const useCounterStore = defineStore('counter', () => {\r
  const count = ref(0)\r
  const name = ref('Eduardo')\r
  const doubleCount = computed(() => count.value * 2)\r
  function increment() {\r
    count.value++\r
  }\r
// 모든 상태 속성을 반환해야 함\r
  * **return { count, name, doubleCount, increment }**\r
})\r
\`\`\`\r
\r
- **ref()** : state 속성\r
- **computed()** : getters\r
- **functions()** : actions\r
\r
✅ Pinia가 상태로 인식하게 하려면 셋업 스토어에서 **모든 상태 속성을 반환**해야 한다.\r
\r
모든 상태 속성을 반환하지 않으면 SSR, devtools 및 기타 플러그인이 손상될 수 있다.\r
\r
셋업 스토어는 옵션 스토어보다 훨씬 더 유연성을 제공한다. 저장소 내에서 **watcher를 생성**하고 모든 **composable을 사용**할 수 있다. 그러나 SSR을 사용할 때 composables 사용이 더 복잡해질 수 있다.\r
\r
셋업 스토어는 또한 **Router나 Route와 같은 전역 속성에 의존**할 수 있다. **앱 수준에서 제공된 어떠한 속성**이라도 **inject()**를 사용하여 스토어에서 접근할 수 있다.\r
\r
\`\`\`jsx\r
import { inject } from 'vue'\r
import { useRoute } from 'vue-router'\r
\r
export const useSearchFilters = defineStore('search-filters', () => {\r
  **const route = useRoute()**\r
  // 이것은 \`app.provide('appProvided', 'value')\`가 호출되었다고 가정함\r
  **const appProvided = inject('appProvided')**\r
\r
  // ...\r
  return {\r
    // ...\r
  }\r
})\r
\`\`\`\r
\r
---\r
\r
## 🔍 스토어 사용\r
\r
\`<script setup>\` 구성요소 내에서 use…Store()가 호출될 때 까지 스토어가 생성되지 않으므로 스토어를 정의해준다.\r
\r
\`\`\`jsx\r
<script setup>\r
**import { useCounterStore } from '@/stores/counter'**\r
\r
// 컴포넌트 어디에서나 \`store\` 변수에 액세스\r
const **store** = useCounterStore()\r
<\/script>\r
\`\`\`\r
\r
스토어가 인스턴스화되면 스토어에서 직접 state, getters, actions에 정의된 모든 속성에 접근이 가능하다.\r
\r
store는 reactive로 래핑된 객체이다. 즉 getter 뒤에 .value를 쓸 필요가 없지만 setup의 props와 같이 구조화할 수 없다.\r
\r
\`\`\`jsx\r
<script setup>\r
import { useCounterStore } from '@/stores/counter'\r
const store = useCounterStore()\r
// ❌ 반응성을 깨뜨리기 때문에 작동하지 않습니다.\r
// \`props\`에서 디스트럭처링하는 것과 동일합니다.\r
**const { name, doubleCount } = store\r
name // 언제나 "Eduardo"\r
doubleCount // 언제나 0**\r
\r
setTimeout(() => {\r
  store.increment()\r
}, 1000)\r
\r
// ✅ 이것은 반응적일 것입니다\r
// 💡 또한 \`store.doubleCount\`로 직접 사용할 수도 있습니다.\r
**const doubleValue = computed(() => store.doubleCount)**\r
<\/script>\r
\`\`\`\r
\r
---\r
\r
## 🔍 저장소에서 드스트럭처링(비구조화)\r
\r
반응형을 유지하면서 스토어에서 속성을 추출하려면, **storeRefs()**를 사용해야한다. 이것은 스토어의 상태만 사용하고 액션을 호출하지 않을 때 유용하다. 스토어 자체에도 바인딩 되므로 스토어에서 직접 액션을 구조화할 수 있다.\r
\r
\`\`\`jsx\r
<script setup>\r
import { useCounterStore } from '@/stores/counter'\r
import { storeToRefs } from 'pinia'\r
\r
const store = useCounterStore()\r
// \`name\`과 \`doubleCount\`는 반응형 refs임.\r
// 이것은 플러그인에 의해 추가된 속성에 대한 'refs'도 추출함.\r
// 그러나 모든 액션 또는 비반응형(ref/반응형이 아닌) 속성을 건너뜀.\r
**const { name, doubleCount } = storeToRefs(store)**\r
// increment 액션은 그냥 구조화 가능.\r
const { increment } = store\r
<\/script>\r
\`\`\`\r
\r
---\r
\r
## 🔍 Options API 에서의 Pinia 스토어 사용\r
\r
아직 setup 컴포넌트를 사용하지 않는 경우에는 “맵 헬퍼”로 피니아를 사용할 수 있다.\r
\r
\`\`\`jsx\r
import { mapStores } from 'pinia'\r
\r
// 다음과 같은 ID를 가진 두 개의 스토어가 있다고 가정합니다.\r
const useUserStore = defineStore('**user**', {\r
  // ...\r
})\r
const useCartStore = defineStore('**cart**', {\r
  // ...\r
})\r
\r
export default {\r
  computed: {\r
    // 배열을 전달하지 않고, 스토어를 하나씩 전달합니다.\r
    // **각 스토어는 ID 뒤에 'Store'를 붙여서 액세스할 수 있습니다.**\r
    ...mapStores(useCartStore, useUserStore)\r
  },\r
\r
  methods: {\r
    async buyStuff() {\r
      // 어디서든 사용할 수 있습니다!\r
      if (this.userStore.isAuthenticated()) {\r
        await this.**cartStore**.buy()\r
        this.$router.push('/purchased')\r
      }\r
    },\r
  },\r
}\r
\`\`\`\r
\r
기본적으로 Pinia는 각 스토어의 id에 “Store” 접미사를 추가한다.\r
\r
접미사는 setMapStoreSuffix()를 호출하여 사용자가 정의할 수 있다.\r
\r
\`\`\`jsx\r
import { createPinia, setMapStoreSuffix } from 'pinia'\r
\r
// 접미사를 완전히 제거합니다: this.user, this.cart\r
setMapStoreSuffix('')\r
// this.user_store, this.cart_store\r
setMapStoreSuffix('_store')\r
export const pinia = createPinia()\r
\`\`\`\r
\r
TypeScript를 사용하는 경우에 접미사를 변경했다면 TS파일이나 global.d.ts파일에 해당 접미사를 추가해야한다. typescript 선언 파일(global.d.ts 등)을 사용하는 경우, 최상단에 import ‘pinia’를 추가해야 한다.\r
\r
\`\`\`jsx\r
import { createPinia, setMapStoreSuffix } from 'pinia'\r
\r
setMapStoreSuffix('') // 접미사를 완전히 제거합니다.\r
export const pinia = createPinia()\r
\r
declare module 'pinia' {\r
  export interface MapStoresCustomization {\r
    // 위와 동일한 값으로 설정하세요.\r
    suffix: ''\r
  }\r
}\r
\`\`\`\r
`;export{r as default};
