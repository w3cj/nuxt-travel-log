<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="flex mt-2 gap-2 overflow-auto">
    <div
      v-for="image in images"
      :key="image.id"
      class="card card-compact h-40 w-64 shrink-0 flex items-center justify-center bg-base-300"
    >
      <div class="card-body size-full">
        <img class="size-full object-cover" :src="`${config.public.s3BucketUrl}/${image.key}`">
      </div>
    </div>
  </div>
</template>
