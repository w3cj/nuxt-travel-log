<script lang="ts" setup>
const props = defineProps<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: "btn-warning" | "btn-error" | "btn-accent" | "btn-primary";
}>();

const emit = defineEmits<{
  onClosed: [];
  onConfirmed: [];
}>();

const dialog = useTemplateRef("dialog");

function onClose() {
  emit("onClosed");
}

onMounted(() => {
  dialog.value?.addEventListener("close", onClose);
});

onUnmounted(() => {
  dialog.value?.removeEventListener("close", onClose);
});
</script>

<template>
  <dialog
    ref="dialog"
    :open="props.isOpen"
    class="modal"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ description }}
      </p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline" @click="onClose">
          Cancel
        </button>
        <button
          class="btn"
          :class="confirmClass"
          @click="emit('onConfirmed')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
    <form
      method="dialog"
      class="modal-backdrop"
    >
      <button>close</button>
    </form>
  </dialog>
</template>
