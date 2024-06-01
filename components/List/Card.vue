<template>
  <div
    @click="
      selectedCard = card;
      emits('openCreateCard');
    "
    class="select-none p-1 border shadow rounded-lg dark:border-gray-700 text-sm cursor-grab bg-white dark:bg-gray-700"
  >
    {{ card.title }}
  </div>
</template>

<script lang="ts" setup>
const { $$globalStore } = useNuxtApp();
const { selectedCard } = storeToRefs($$globalStore);
const props = defineProps(["card"]);
const { card } = toRefs(props);
const emits = defineEmits(["openCreateCard"]);
</script>
