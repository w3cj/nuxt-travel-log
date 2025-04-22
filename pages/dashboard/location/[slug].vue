<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const locationStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

onMounted(() => {
  locationStore.refreshCurrentLocation();
});

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}`, {
      method: "DELETE",
    });
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && location && !loading">
      <h2 class="text-xl">
        {{ location.name }}
        <div class="dropdown dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="{
                  name: 'dashboard-location-slug-edit',
                  params: { slug: route.params.slug },
                }"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
        <NuxtLink
          class="btn btn-primary mt-2"
          :to="{
            name: 'dashboard-location-slug-add',
            params: { slug: route.params.slug },
          }"
        >
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </NuxtLink>
      </div>
    </div>
    <div
      v-if="route.name === 'dashboard-location-slug' && !loading && location?.locationLogs.length"
      class="location-list"
    >
      <LocationCard
        v-for="log in location.locationLogs"
        :key="log.id"
        :map-point="createMapPointFromLocationLog(log)"
      >
        <template #top>
          <p class="text-sm italic text-gray-500">
            <span v-if="log.startedAt !== log.endedAt">
              {{ formatDate(log.startedAt) }} / {{ formatDate(log.endedAt) }}
            </span>
            <span v-else>
              {{ formatDate(log.startedAt) }}
            </span>
          </p>
        </template>
      </LocationCard>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      title="Are you sure?"
      description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete this location!"
      confirm-class="btn-error"
      :is-open="isOpen"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
