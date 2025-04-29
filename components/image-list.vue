<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

const props = defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();
const isGalleryVisible = ref(false);
const galleryIndex = ref(0);
const galleryImages = computed(() => props.images.map(image => `${config.public.s3BucketUrl}/${image.key}`));

function showImage(index: number) {
  galleryIndex.value = index;
  isGalleryVisible.value = true;
}

function closeGallery() {
  isGalleryVisible.value = false;
}
</script>

<template>
  <div class="flex mt-2 gap-2 overflow-auto">
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="card card-compact h-40 w-64 shrink-0 flex items-center justify-center bg-base-300"
    >
      <div class="card-body size-full">
        <img
          class="size-full object-cover cursor-pointer"
          :src="`${config.public.s3BucketUrl}/${image.key}`"
          @click="showImage(index)"
        >
        <slot :image name="card-bottom" />
      </div>
    </div>
    <VueEasyLightbox
      :visible="isGalleryVisible"
      :imgs="galleryImages"
      :index="galleryIndex"
      :loop="true"
      @hide="closeGallery"
    >
      <template #toolbar>
        <span />
      </template>
    </VueEasyLightbox>
  </div>
</template>
