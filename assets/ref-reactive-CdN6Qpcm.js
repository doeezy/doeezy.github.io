const r=`---\r
title: ref & reactive\r
menu: vuejs\r
date: 2025-01-01\r
tags:\r
- Vue.js\r
- Vue3\r
- frontend\r
---\r
\r
## 🔍 Vue3 반응형 데이터\r
Vue3 Composition API에서 반응형 Data를 사용하는 방법으로는 ref와 reactive가 있다.\r
\r
\`\`\`jsx\r
<!-- vue3 이전 -->\r
<script>\r
export default {\r
	data() {\r
		return {\r
			count: 0;\r
		}\r
	}\r
}\r
<\/script>\r
\r
<!-- vue3 -->\r
<script setup>\r
import {ref, reactive} from "vue";\r
const countRef = ref(0);\r
const countReactive = reactive({});\r
<\/script>\r
\`\`\`\r
\r
### ⭐ ref()\r
\r
Vue3에서 추가된 반응형 데이터를 사용할때 쓰이는 Composition API이며 **원시타입일때 주로 사용한다. (String, Number, Boolean, etc…)**\r
\r
.value로 접근하며 새 값을 할당할 수 있다.\r
\r
주로 원시 타입일 때에 사용하지만 object 타입도 사용 가능하다.\r
\r
ref()는 내부에 값을 취하는 ref Object를 반환하는데 **component나 view에서 해당 ref를 사용할 때에는 내부 값이 자동으로 언래핑 되기 때문에 ref 변수명을 그대로 사용한다.**\r
\r
\`\`\`jsx\r
<template>\r
{{ refCount }} // 변수명으로 접근\r
</template>\r
\r
<script setup>\r
import {ref} from "vue";\r
\r
const refCount = ref(0);\r
// refCount.value로 접근\r
<\/script>\r
\`\`\`\r
\r
<br>\r
\r
### ⭐ reactive()\r
\r
reactive()는 ref()와 다르게 **원시 타입을 사용할 수 없다. object, Array만 사용 가능하다.**\r
\r
reactive() 안에는 함수도 집어넣을 수 있다.\r
\r
\`\`\`jsx\r
<template>\r
{{ calculator.count }}\r
{{ calculator.changeNum }}\r
</template>\r
\r
<script setup>\r
import {reactive} from "vue";\r
\r
const calculator = reactive({\r
	count: 1,\r
	changeNum: computed(() => \`\${state.num}\`)\r
})\r
<\/script>\r
\`\`\`\r
\r
---\r
\r
## 🔍 ref()와 reactive() 의 차이점\r
\r
- ref()에서는 String, Number, Object 어떤 타입이든 사용 가능하다.\r
- reactive()에서는 Object 타입만 가능하다. (Object, Array, Map, Set)\r
- ref()는 .value를 통해서 접근할 수 있고 reactive()는 붙이지 않아도 접근 가능하다.\r
- reactive()는 함수도 넣을 수 있다.\r
- object일 경우 ref()는 재할당 하면 반응형을 유지하지만 reactive()는 재할당하면 반응형을 잃어버린다.\r
\r
\`\`\`jsx\r
let refObj = ref({});\r
let reactiveObj = reactive({});\r
\r
const newData = { title: "hello world" };\r
\r
// 재할당\r
refObj.value = { ...newData };\r
reactiveObj.value = { ...newData };\r
\r
// object를 재할당 하게되면 ref는 반응형을 유지, reactive는 반응형 소실\r
\`\`\`\r
`;export{r as default};
