<script lang="ts" setup>
const locationStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refreshCurrentLocation();
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
      </div>
      <button class="btn btn-primary mt-2">
        Add Location Log
        <Icon name="tabler:map-pin-plus" size="24" />
      </button>
    </div>
    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-lg">
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>
