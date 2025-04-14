import type { SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentLocationInSidebar = new Set([
  "dashboard-location-slug",
  "dashboard-location-slug-edit",
  "dashboard-location-slug-add",
]);

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations", {
    lazy: true,
  });

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (locations.value && listLocationsInSidebar.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (currentLocation.value && listCurrentLocationInSidebar.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }
    sidebarStore.loading = locationsStatus.value === "pending";
  });

  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
  };
});
