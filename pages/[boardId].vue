<template>
  <WrapperDefault
    class="h-screen"
    :style="`background: url(${data?.coverImage}) no-repeat center center; background-size: cover`"
  >
    <template #action>
      <UButton
        size="xs"
        label="Create List"
        @click="
          showListCreate = true;
          $$globalStore.resetSelectedList();
        "
      />
    </template>

    <USlideover v-model="showListCreate">
      <OverlayHeader
        :title="selectedList ? 'Update list' : 'Create list'"
        @close="showListCreate = false"
      />

      <div class="p-4">
        <FormList
          @close="showListCreate = false"
          :type="selectedList ? 'update' : 'create'"
          :initialData="selectedList"
          :boardId="boardId"
          :listLength="data?.lists.length"
        />
      </div>
    </USlideover>

    <div v-if="data" class="relative h-full w-full top-0 left-0">
      <h1 class="text-3xl font-semibold mb-4 inline-block">{{ data.name }}</h1>

      <ListContainer :lists="data.lists" @open="showListCreate = true" />
    </div>
  </WrapperDefault>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const { $$auth, $$globalStore } = useNuxtApp();
const { selectedList } = storeToRefs($$globalStore);

const { boardId } = useRoute().params;

const showListCreate = ref(false);

const { data, refresh: refreshBoard } = await useFetch(
  `/api/boards/${boardId}`
);

useHead({
  title: data.value?.name,
  titleTemplate: "%s - Board",
});

provide("refreshBoard", refreshBoard);

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: "Board not found",
  });
}
</script>
