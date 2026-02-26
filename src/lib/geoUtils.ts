const MAP_BOUNDS = {
  minLat: 27.059125,
  maxLat: 27.068909,
  minLng: 85.347290,
  maxLng: 85.358276,
};

const PLANE_SIZE = 10;

export function geoToPlane(lat: number, lng: number): [number, number, number] {
  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
      PLANE_SIZE -
    PLANE_SIZE / 2;

  const z =
    ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
      PLANE_SIZE -
    PLANE_SIZE / 2;

  return [x, 0, -z];
}

export { MAP_BOUNDS, PLANE_SIZE };