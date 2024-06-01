<template>
  <UModal v-model="subscriptionModelState">
    <div class="p-8 text-center">
      <h1 class="text-2xl font-medium">{{ modelTitle }}</h1>
      <div class="mt-4 text-gray-500 dark:text-gray-300">
        {{ modelDescription }}
      </div>
      <NuxtImg
        preload
        src="/images/boards.png"
        class="w-10/12 my-8 mx-auto block"
      />
      <UButton
        class="mt-4 block"
        :loading="isLoading"
        @click="subscribe"
        label="Subscribe only for đ100.000 per month"
        block
      />
    </div>
  </UModal>
</template>

<script lang="ts" setup>
const {
  modelTitle,
  hideSubscriptionModel,
  isLoading,
  modelDescription,
  showSubscriptionModel,
  subscribe,
  subscriptionModelState,
} = useUseSubscription();
</script>
