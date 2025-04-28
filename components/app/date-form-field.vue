<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
});

function formatDateISO(value: number) {
  try {
    return new Date(value).toISOString().split("T")[0];
  }
  catch {
    return "";
  }
}

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  try {
    const value = new Date(target.value).getTime();
    handleChange(value);
  }
  catch {}
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="disabled"
      class="w-full input"
      :class="{
        'input-error': props.error,
      }"
      :value="formatDateISO(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
