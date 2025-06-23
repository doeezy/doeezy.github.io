---
title: ref & reactive
menu: vuejs
date: 2025-01-01
tags:
- Vue.js
- Vue3
- frontend
---

## 🔍 Vue3 반응형 데이터
Vue3 Composition API에서 반응형 Data를 사용하는 방법으로는 ref와 reactive가 있다.

```jsx
<!-- vue3 이전 -->
<script>
export default {
	data() {
		return {
			count: 0;
		}
	}
}
</script>

<!-- vue3 -->
<script setup>
import {ref, reactive} from "vue";
const countRef = ref(0);
const countReactive = reactive({});
</script>
```

### ⭐ ref()

Vue3에서 추가된 반응형 데이터를 사용할때 쓰이는 Composition API이며 **원시타입일때 주로 사용한다. (String, Number, Boolean, etc…)**

.value로 접근하며 새 값을 할당할 수 있다.

주로 원시 타입일 때에 사용하지만 object 타입도 사용 가능하다.

ref()는 내부에 값을 취하는 ref Object를 반환하는데 **component나 view에서 해당 ref를 사용할 때에는 내부 값이 자동으로 언래핑 되기 때문에 ref 변수명을 그대로 사용한다.**

```jsx
<template>
{{ refCount }} // 변수명으로 접근
</template>

<script setup>
import {ref} from "vue";

const refCount = ref(0);
// refCount.value로 접근
</script>
```

<br>

### ⭐ reactive()

reactive()는 ref()와 다르게 **원시 타입을 사용할 수 없다. object, Array만 사용 가능하다.**

reactive() 안에는 함수도 집어넣을 수 있다.

```jsx
<template>
{{ calculator.count }}
{{ calculator.changeNum }}
</template>

<script setup>
import {reactive} from "vue";

const calculator = reactive({
	count: 1,
	changeNum: computed(() => `${state.num}`)
})
</script>
```

---

## 🔍 ref()와 reactive() 의 차이점

- ref()에서는 String, Number, Object 어떤 타입이든 사용 가능하다.
- reactive()에서는 Object 타입만 가능하다. (Object, Array, Map, Set)
- ref()는 .value를 통해서 접근할 수 있고 reactive()는 붙이지 않아도 접근 가능하다.
- reactive()는 함수도 넣을 수 있다.
- object일 경우 ref()는 재할당 하면 반응형을 유지하지만 reactive()는 재할당하면 반응형을 잃어버린다.

```jsx
let refObj = ref({});
let reactiveObj = reactive({});

const newData = { title: "hello world" };

// 재할당
refObj.value = { ...newData };
reactiveObj.value = { ...newData };

// object를 재할당 하게되면 ref는 반응형을 유지, reactive는 반응형 소실
```
