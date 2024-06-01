<template>
  <draggableComponent
    :list="lists"
    item-key="lists"
    handle=".list-handle"
    :scroll-sensitivity="250"
    :force-fallback="true"
    class="flex gap-4 h-[80vh] overflow-x-auto pb-2"
    ghost-class="ghost-board"
    drag-class="dragging-board"
    @sort="handleSort($event, lists)"
  >
    <template #item="{ element }">
      <ListItem :list="element" @open="emits('open')" />
    </template>
  </draggableComponent>
</template>

<script lang="ts" setup>
import { useUseList } from "~/composables/useList";
import draggableComponent from "vuedraggable";

const refreshBoard = inject("refreshBoard") as () => void;

const emits = defineEmits(["open"]);
const props = defineProps(["lists"]);
const { lists } = toRefs(props);
const { handleSort } = useUseList();
</script>

<style>
.ghost-board > div {
  opacity: 0.5;
}

.ghost-board > div > div {
  visibility: hidden;
}

.dragging-board {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: rotate(2deg);
  cursor: grabbing;
}
</style>
