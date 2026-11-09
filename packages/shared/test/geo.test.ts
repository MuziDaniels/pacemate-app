import { describe, expect, it } from "vitest";
import { haversineM, trackDistanceM } from "../src/geo/distance.js";
import { formatPace, paceSPerKm } from "../src/geo/pace.js";

// Known pair: Pietermaritzburg City Hall to Durban City Hall. Straight-line
// (great-circle) distance is ~68.4 km; the Comrades race is ~88 km by road.
const PMB = { lat: -29.6006, lng: 30.3794 };
const DBN = { lat: -29.8587, lng: 31.0218 };

describe("haversineM", () => {
  it("matches the known PMB-Durban great-circle distance within ~1%", () => {
    const d = haversineM(PMB, DBN);
    expect(d).toBeGreaterThan(67_700);
    expect(d).toBeLessThan(69_100);
  });
  it("is zero for identical points", () => {
    expect(haversineM(PMB, PMB)).toBe(0);
  });
});

describe("trackDistanceM", () => {
  it("skips low-accuracy points instead of accumulating jitter", () => {
    const base = { recordedAt: "2026-01-01T06:00:00Z", seq: 0, ...PMB };
    const points = [
      { ...base, seq: 0, accuracyM: 5 },
      { ...base, seq: 1, lat: PMB.lat + 0.01, accuracyM: 500 }, // junk fix
      { ...base, seq: 2, accuracyM: 5 },
    ];
    expect(trackDistanceM(points)).toBe(0);
  });
});

describe("pace", () => {
  it("returns null below the minimum distance", () => {
    expect(paceSPerKm(10, 60)).toBeNull();
  });
  it("computes 6:00 /km for 1 km in 360 s", () => {
    expect(paceSPerKm(1000, 360)).toBe(360);
    expect(formatPace(360)).toBe("6:00");
  });
});
