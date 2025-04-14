<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation | null;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values: InsertLocation) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <span>{{ submitError }}</span>
  </div>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
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
    <p class="text-xs text-gray-400">
      Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
    </p>
    <p>
      To set the coordinates:
    </p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
      </li>
      <li>
        Double click the map.
      </li>
      <li>
        Search for a location below.
      </li>
    </ul>
    <div class="flex justify-end gap-2">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
        @click="router.back()"
      >
        <Icon name="tabler:arrow-left" size="24" />
        Cancel
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-else
          :name="props.submitIcon"
          size="24"
        />
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
