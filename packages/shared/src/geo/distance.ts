import type { GpsPoint } from "../types";

const EARTH_RADIUS_M = 6371008.8;

export function haversineM(
  a: Pick<GpsPoint, "lat" | "lng">,
  b: Pick<GpsPoint, "lat" | "lng">,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(s));
}

/**
 * Track distance with an accuracy gate: points with poor reported accuracy
 * are skipped so GPS jitter while standing still does not inflate distance.
 */
export function trackDistanceM(
  points: readonly GpsPoint[],
  maxAccuracyM = 30,
): number {
  let total = 0;
  let prev: GpsPoint | undefined;
  for (const p of points) {
    if (p.accuracyM !== undefined && p.accuracyM > maxAccuracyM) continue;
    if (prev) total += haversineM(prev, p);
    prev = p;
  }
  return total;
}
