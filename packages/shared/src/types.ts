// Canonical domain types. DB rows are snake_case; these are the camelCase
// domain shapes. Mapping happens once per module, never ad hoc.

export type Role = "runner" | "coach";
export type SessionStatus = "active" | "completed" | "abandoned";
export type CueKind = "coach" | "engine" | "cheer" | "sos";

export interface GpsPoint {
  seq: number;
  recordedAt: string; // ISO UTC
  lat: number;
  lng: number;
  altitudeM?: number;
  accuracyM?: number;
  speedMps?: number;
}

export interface LiveStats {
  distanceM: number;
  durationS: number;
  paceSPerKm: number | null; // null until enough distance
  bpm?: number;
}

export interface ClimbAhead {
  distanceToStartM: number;
  lengthM: number;
  avgGradePct: number;
}
