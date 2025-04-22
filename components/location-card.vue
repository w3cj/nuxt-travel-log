<script lang="ts" setup>
import type { MapPoint } from "~/lib/types";

defineProps<{
  mapPoint: MapPoint;
}>();

const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    class="card card-compact bg-base-300 h-40 border-2 w-72 mb-2 shrink-0 hover:cursor-pointer"
    :to="mapPoint.to"
    :class="{
      'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
      'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint),
    }"
    @mouseenter="mapStore.selectedPoint = mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <div class="card-body">
      <slot name="top" />
      <h3 class="text-xl">
        {{ mapPoint.name }}
      </h3>
      <p>{{ mapPoint.description }}</p>
    </div>
  </NuxtLink>
</template>
