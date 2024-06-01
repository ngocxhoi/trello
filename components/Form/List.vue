<template>
  <div>
    <UForm :state="formState" :schema="ListSchema" @submit="handleSubmit">
      <UFormGroup class="mt-4" label="Name" name="name">
        <UInput autofocus v-model="formState.name" />
      </UFormGroup>

      <UButton
        :loading="isLoading"
        :label="type == 'create' ? 'Create' : 'Update'"
        block
        class="mt-4"
        type="submit"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { ListSchema } from "~/schemas/List.schema";
type Schema = z.output<typeof ListSchema>;
const { $$globalStore } = useNuxtApp();
const { selectedBoard } = storeToRefs($$globalStore);

const props = defineProps(["type", "initialData", "boardId", "listLength"]);
const { type, initialData, boardId, listLength } = toRefs(props);
const emits = defineEmits(["close"]);

const refreshBoard = inject("refreshBoard") as () => void;

const isLoading = ref(false);
const formState = ref({
  name: "",
  description: undefined,
  boardId: boardId?.value,
  order: listLength?.value + 1,
});

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    if (type?.value == "update" && initialData?.value) {
      let { data, error } = await useFetch(
        `/api/lists/${initialData.value?.id}`,
        {
          method: "put",
          body: {
            name: event.data.name,
          },
          watch: false,
        }
      );

      if (error.value) throw error.value;

      useToast().add({
        title: "Lists Updated",
        icon: "i-heroicons-check",
      });
      return;
    }

    let { data, error } = await useFetch("/api/lists", {
      method: "post",
      body: event.data,
      watch: false,
    });

    if (error.value) throw error.value;

    useToast().add({
      title: "Lists Created",
      icon: "i-heroicons-check",
    });
  } catch (error: any) {
    console.log(error);
    useToast().add({
      title: "Opp!",
      description: error.message || "Some thing wen't wrong!",
      timeout: 5000,
      icon: "i-heroicons-x-mark",
      color: "red",
    });
  } finally {
    isLoading.value = false;
    emits("close");
    refreshBoard();
  }
}

watchEffect(() => {
  if (type?.value === "update" && initialData?.value) {
    formState.value = initialData.value;
  }

  // if(board.value.type === 'create') {
  //   formState.name = undefined
  //   formState.coverImage = undefined
  // }
});
</script>

<style></style>
