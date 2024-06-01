<template>
  <div>
    <UForm :state="formState" :schema="CardSchema">
      <UFormGroup class="mt-4" label="Title" name="title">
        <UInput autofocus v-model="formState.title" />
      </UFormGroup>

      <UFormGroup class="mt-4" label="Description" name="description">
        <ClientOnly fallback-tag="div" fallback="Loading editor...">
          <QuillEditor
            content-type="html"
            theme="snow"
            name="description"
            label="Description"
            v-model:content="formState.description"
            class="dark:text-white"
          />
        </ClientOnly>
      </UFormGroup>

      <UButton
        v-if="type == 'update'"
        :loading="deleting"
        block
        label="Delete"
        type="button"
        variant="soft"
        color="red"
        class="mt-4"
        @click="handleDelete"
      />
      <UButton
        :loading="isLoading"
        :label="type == 'create' ? 'Create' : 'Update'"
        block
        class="mt-4"
        type="submit"
        @click="handleSubmit"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { CardSchema } from "~/schemas/Card.schema";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";
type Schema = z.output<typeof CardSchema>;

const { updateCard, createCard, deleteCard } = useUseCard();
const props = defineProps(["type", "initialData", "listId", "currentOrder"]);
const { type, initialData, listId, currentOrder } = toRefs(props);
const emits = defineEmits(["close"]);
const refreshBoard = inject("refreshBoard") as () => void;

const isLoading = ref(false);
const deleting = ref(false);
const formState = ref({
  title: "",
  description: "",
  order: currentOrder?.value + 1,
  listId: listId?.value,
});

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    if (type?.value == "update" && initialData?.value) {
      let res = await updateCard(listId?.value, initialData?.value.id, {
        title: formState.value.title,
        description: formState.value.description,
      });

      if (res?.value) {
        useToast().add({
          title: "Card Updated",
          icon: "i-heroicons-check",
        });
      }
    }

    await createCard(listId?.value, formState.value);
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

const handleDelete = async () => {
  try {
    await deleteCard(listId?.value, initialData?.value.id);
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
    deleting.value = false;
    emits("close");
    refreshBoard();
  }
};

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
