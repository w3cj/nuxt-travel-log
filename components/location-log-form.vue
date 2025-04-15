<script lang="ts" setup>
import { CENTER_USA } from "~/lib/constants";
import { InsertLocationLog } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocationLog;
  onSubmit: (location: InsertLocationLog) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - (24 * 60 * 60 * 1000),
  endedAt: Date.now(),
  long: (CENTER_USA as [number, number])[0],
  lat: (CENTER_USA as [number, number])[1],
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="11"
    :schema="InsertLocationLog"
    :initial-values="props.initialValues || initialValues"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
  >
    <AppFormField
      name="name"
      label="Name"
      :error="errors.name"
      :disabled="loading"
    />
    <AppFormField
      name="description"
      label="Description"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
    />
    <AppDateFormField
      name="startedAt"
      label="Started At"
      :value="initialValues.startedAt"
      :error="errors.startedAt"
      :disabled="loading"
    />
    <AppDateFormField
      name="endedAt"
      label="Ended At"
      :value="initialValues.endedAt"
      :error="errors.endedAt"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
