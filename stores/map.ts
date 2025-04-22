import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean; zoom?: number } | null>(null);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    let bounds: LngLatBounds | null = null;
    const padding = 60;

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint) {
        map.map?.flyTo({
          center: CENTER_USA,
          zoom: 2,
        });
        return;
      }

      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      map.map?.fitBounds(bounds, {
        padding,
        maxZoom: 10,
      });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          speed: 0.8,
          zoom: newValue.zoom || 6,
        });
      }
    }, {
      immediate: true,
    });
  }

  return {
    init,
    addedPoint,
    mapPoints,
    selectedPoint,
  };
});
