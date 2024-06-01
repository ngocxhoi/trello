<template>
  <div class="shadow dark:bg-gray-800 rounded-lg overflow-hidden relative">
    <div v-if="board.coverImage" class="h-36 w-full relative z-10">
      <NuxtImg
        preload
        :src="board.coverImage"
        :alt="board.name"
        class="h-full w-full object-cover z-10"
      />
      <div
        class="absolute w-full h-full z-[2] bg-gradient-t-b from-black/90 to-transparent"
      />

      <div
        class="flex w-full justify-between items-center gap-2 absolute left-0 z-10 top-0 py-2 px-4"
      >
        <NuxtLink
          :to="{
            name: 'boardId',
            params: { boardId: board.id },
          }"
          class="font-semibold text-white truncate"
        >
          {{ board.name }}
        </NuxtLink>

        <UDropdown :items="action">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="dark:text-white text-black"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["board"]);
const { board } = toRefs(props);
const emits = defineEmits(["onEdit"]);

const { onDelete } = useUseBoard();
const refreshBoards = inject("refreshBoards") as () => void;

const action = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil",
      click: () => {
        emits("onEdit", board?.value);
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: async () => {
        await handleDelete();
      },
    },
  ],
];

async function handleDelete() {
  try {
    const res = await onDelete(board?.value.id);
    if (res) {
      refreshBoards();
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
