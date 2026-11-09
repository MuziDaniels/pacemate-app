/** Seconds per km, or null when distance is too small to be meaningful. */
export function paceSPerKm(distanceM: number, durationS: number): number | null {
  if (distanceM < 50) return null;
  return durationS / (distanceM / 1000);
}

export function formatPace(sPerKm: number | null): string {
  if (sPerKm === null || !Number.isFinite(sPerKm)) return "--:--";
  const m = Math.floor(sPerKm / 60);
  const s = Math.round(sPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
