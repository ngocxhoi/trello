<template>
  <div>
    <UForm :state="formState" :schema="BoardSchema" @submit="handleSubmit">
      <UFormGroup class="mt-4" label="Name" name="name">
        <UInput autofocus v-model="formState.name" />
      </UFormGroup>

      <UFormGroup class="mt-4" label="Cover Image" name="coverImage">
        <ImagePicker v-model:modelValue="formState.coverImage" />
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
import { BoardSchema } from "~/schemas/Board.schema";
type Schema = z.output<typeof BoardSchema>;
const { $$globalStore } = useNuxtApp();
const { selectedBoard } = storeToRefs($$globalStore);
const { showSubscriptionModel } = useUseSubscription();

const props = defineProps(["type", "initialData"]);
const { type, initialData } = toRefs(props);

const openSlideover = inject("openSlideover") as Ref<boolean>;
const refreshBoards = inject("refreshBoards") as () => void;

const isLoading = ref(false);
const formState = ref({
  name: "",
  description: undefined,
  coverImage: undefined,
});

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true;
    if (type?.value == "update" && initialData?.value) {
      let { data, error } = await useFetch(
        `/api/boards/${initialData.value?.id}`,
        {
          method: "put",
          body: event.data,
          watch: false,
        }
      );

      if (error.value) throw error.value;
      selectedBoard.value = data.value;

      useToast().add({
        title: "Board Updated",
        icon: "i-heroicons-check",
      });
      return;
    }

    let { error } = await useFetch("/api/boards", {
      method: "post",
      body: event.data,
      watch: false,
    });

    if (error.value) {
      if (error.value.statusCode == 403) {
        showSubscriptionModel({
          title: "Multipe board is a premium feature",
          description: "Please subscribe to create multiple boards",
        });
      }
      throw error.value.data;
    }
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
    openSlideover.value = false;
    refreshBoards();
  }
}

watchEffect(() => {
  if (type?.value === "update" && initialData?.value) {
    formState.value.name = initialData.value.name;
    formState.value.coverImage = initialData.value.coverImage;
  }

  // if(board.value.type === 'create') {
  //   formState.name = undefined
  //   formState.coverImage = undefined
  // }
});
</script>

<style></style>
