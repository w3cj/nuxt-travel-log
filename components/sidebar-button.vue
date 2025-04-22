<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <div
    class="tooltip-right"
    :data-tip="showLabel ? undefined : props.label"
    :class="{ tooltip: !showLabel }"
  >
    <NuxtLink
      :to="props.href || props.to"
      :class="{ 'bg-base-200': route.path === props.href, 'justify-center': !showLabel, 'justify-start': showLabel }"
      class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer flex-nowrap"
    >
      <Icon
        :name="props.icon"
        size="24"
        :class="iconColor"
      />
      <Transition name="grow">
        <span v-if="showLabel" class="truncate">{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 0.2s;
}
.grow-leave-active {
  animation: grow 0.2s reverse;
}
@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
