<script lang="ts" setup>
import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from "~/lib/constants";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const locationsStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "") || CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocation();
}

if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocationLog();
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Locations",
      href: "/dashboard",
      icon: "tabler:map",
    }, {
      id: "link-location-add",
      label: "Add Location",
      href: "/dashboard/add",
      icon: "tabler:circle-plus-filled",
    }];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Back to Locations",
      href: "/dashboard",
      icon: "tabler:arrow-left",
    }];

    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems.push({
        id: "link-dashboard",
        label: currentLocation.value.name,
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:map",
      }, {
        id: "link-location-edit",
        label: "Edit Location",
        to: {
          name: "dashboard-location-slug-edit",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:map-pin-cog",
      }, {
        id: "link-location-add",
        label: "Add Location Log",
        to: {
          name: "dashboard-location-slug-add",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:circle-plus-filled",
      });
    }
  }
  else if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems = [{
        id: "link-location",
        label: `Back to "${currentLocation.value.name}"`,
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:arrow-left",
      }, {
        id: "link-view-location-log",
        label: "View Log",
        to: {
          name: "dashboard-location-slug-id",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:map-pin",
      }, {
        id: "link-edit-location-log",
        label: "Edit Log",
        to: {
          name: "dashboard-location-slug-id-edit",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:map-pin-cog",
      }, {
        id: "link-location-log-images",
        label: "Manage Images",
        to: {
          name: "dashboard-location-slug-id-images",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:photo-cog",
      }];
    }
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 transition-all duration-300 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        class="flex hover:cursor-pointer hover:bg-base-200 p-2"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />
        <div v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'" class="flex items-center justify-center">
          <div class="loading" />
        </div>
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{
          'flex-col': !EDIT_PAGES.has(route.name?.toString() || ''),
        }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
