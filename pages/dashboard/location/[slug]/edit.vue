<script lang="ts" setup>
import type { InsertLocation } from "~/lib/db/schema";

const route = useRoute();
const locationStore = useLocationStore();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/locations/${route.params.slug}`, {
    method: "put",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <LocationForm
    v-if="locationStore.currentLocationStatus !== 'pending'"
    :on-submit
    :on-submit-complete
    :initial-values="locationStore.currentLocation"
    submit-label="Update"
    submit-icon="tabler:map-pin-up"
  />
</template>
