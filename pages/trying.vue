<template>
  <div>
    <pre class="text-red-500">
      {{ data }}
    </pre>
  </div>
</template>

<script lang="ts" setup>
const data = ref();
onMounted(async () => {
  let { data: res } = await useFetch("/api/test");
  data.value = res.value;
});
</script>
