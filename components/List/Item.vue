<template>
  <div class="flex">
    <div
      class="w-80 shadow flex-none bg-white dark:bg-gray-800 rounded-lg flex flex-col"
    >
      <!-- List header -->
      <div
        class="list-handle p-2 border-b dark:border-gray-700 flex items-center justify-between"
      >
        <h3 class="font-medium">{{ list.name }}</h3>

        <UDropdown :items="listActions">
          <UIcon name="i-heroicons-cog-6-tooth" />
        </UDropdown>
      </div>

      <!-- List body -->
      <div class="list-body p-2 flex-1 overflow-y-auto">
        <vuedragable
          v-if="list.cards"
          :list="list.cards"
          item-key="id"
          group="list"
          ghost-class="card-ghost"
          :scroll-sensitivity="250"
          :force-fallback="true"
          @change="handleCardChange"
          class="p-2 h-full space-y-2 flex-1 overflow-y-hidden text-sm"
        >
          <template #item="{ element }">
            <ListCard :card="element" @openCreateCard="showCardCreate = true" />
          </template>
        </vuedragable>
      </div>

      <!-- List footer -->
      <div class="p-1 border-t dark:border-gray-600 flex items-center">
        <UButton
          block
          label="Add card"
          @click="
            $$globalStore.resetSelectedCard();
            showCardCreate = true;
          "
        />
      </div>

      <Teleport to="body">
        <UModal v-model="showCardCreate">
          <UCard>
            <OverlayHeader
              :title="selectedCard ? 'Update card' : 'Create card'"
              @close="showCardCreate = false"
            />
            <div class="p-2">
              <FormCard
                @close="showCardCreate = false"
                :type="selectedCard ? 'update' : 'create'"
                :listId="list.id"
                :initialData="selectedCard"
                :currentOrder="list.cards.length"
              />
            </div>
          </UCard>
        </UModal>
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { List } from "@prisma/client";
import vuedragable from "vuedraggable";

const { $$globalStore } = useNuxtApp();
const { selectedList, selectedCard } = storeToRefs($$globalStore);
const { onDelete } = useUseList();
const { changeCard, updateCard } = useUseCard();

const props = defineProps(["list"]);
const { list } = toRefs(props);
const emits = defineEmits(["open"]);
const refreshBoard = inject("refreshBoard") as () => void;
const showCardCreate = ref(false);

const listActions = [
  [
    {
      label: "Add card",
      icon: "i-heroicons-plus-circle",
      click: () => {
        $$globalStore.resetSelectedCard();
        showCardCreate.value = true;
      },
    },
  ],
  [
    {
      label: "Update list",
      icon: "i-heroicons-pencil",
      click: () => {
        selectedList.value = list?.value;
        emits("open");
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: () => {
        handleDelete(list?.value);
      },
    },
  ],
];

async function handleDelete(list: List) {
  try {
    let data = await onDelete(list.id);
    if (data) refreshBoard();
  } catch (error) {
    return error;
  }
}

async function handleCardChange(e: any) {
  try {
    if (e.moved) {
      let { oldIndex, newIndex } = e.moved;
      if (newIndex == oldIndex) return;
      console.log(oldIndex, newIndex);
      let indexFrom = Math.min(oldIndex, newIndex);
      let indexTo = indexFrom == oldIndex ? newIndex : oldIndex;

      for (let i = indexFrom; i <= indexTo; i++) {
        await updateCard(list?.value.cards[i].id, list?.value.id, {
          order: i + 1,
        });
      }
    } else await changeCard(list?.value.id, list?.value.cards);
  } catch (error) {
    console.log(error);
  }
}
</script>

<style>
.card-ghost {
  background: rgb(243, 244, 246);
  border-radius: 0.5rem;
}

.card-ghost > div {
  visibility: hidden;
}

.dark\:card-ghost {
  background: rgb(55, 65, 81);
  border-radius: 0.5rem;
}
</style>
