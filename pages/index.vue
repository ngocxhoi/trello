<template>
  <WrapperDefault>
    <template #action>
      <UButton
        @click="
          showCreateBoard = true;
          $$globalStore.resetSelectedBoard();
        "
        label="Create board"
        size="xs"
      />
    </template>

    <USlideover v-model="showCreateBoard">
      <OverlayHeader
        :title="selectedBoard ? 'Update this board' : 'Create a board'"
      />

      <div class="p-4">
        <FormBoard
          :type="selectedBoard ? 'update' : 'create'"
          :initialData="selectedBoard"
        />
      </div>
    </USlideover>

    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
      <BoardCard
        v-for="board in boards"
        :key="board.id"
        :board="board"
        @onEdit="
          (board) => {
            (selectedBoard = board), (showCreateBoard = true);
          }
        "
      />
    </div>
  </WrapperDefault>
</template>

<script setup lang="ts">
useHead({
  title: "Boards",
  meta: [
    {
      name: "description",
      content: "Boards",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ],
});

const { $$auth, $$globalStore } = useNuxtApp();
const { selectedBoard } = storeToRefs($$globalStore);
definePageMeta({
  middleware: "auth",
});

const showCreateBoard = ref(false);
provide("openSlideover", showCreateBoard);

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [showCreateBoard],
    handler: () => {
      showCreateBoard.value = false;
    },
  },
});

const { data: boards, refresh: refreshBoards } = await useFetch("/api/boards", {
  method: "get",
});

provide("refreshBoards", refreshBoards);

// watch(
//   () => showCreateBoard.value,
//   (val) => {
//     if (!val) {
//       $$globalStore.resetSelectedBoard();
//     }
//   }
// );
</script>

<style></style>
