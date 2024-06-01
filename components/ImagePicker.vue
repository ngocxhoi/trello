<template>
  <ul
    v-if="dataHits?.hits"
    class="grid grid-cols-4 gap-2 overflow-y-auto h-60 p-2"
  >
    <li
      v-for="image in dataHits.hits"
      class="h-12 relative rounded overflow-hidden cursor-point outline outline-transparent focus:outline-blue-500 hover:outline-blue-500"
      :class="{
        'ring-2 ring-blue-500 shadow': modelValue === image.largeImageURL,
      }"
      @click="emits('update:modelValue', image.largeImageURL)"
    >
      <NuxtImg
        loading="lazy"
        :src="image.previewURL"
        class="w-full h-full absolute object-cover"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const props = defineProps(["modelValue"]);
const { modelValue } = toRefs(props);
const emits = defineEmits(["update:modelValue"]);

const dataHits = ref();

try {
  let { data, error } = await useFetch(
    `https://pixabay.com/api/?key=${config.public.PIXABAY_API_KEY}&q=yellow+flowers&image_type=photo`
  );
  if (error.value) throw error.value;

  dataHits.value = data.value;
} catch (error) {
  console.log(error);
}
</script>
