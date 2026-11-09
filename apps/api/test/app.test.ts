import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const config = {
  databaseUrl: "postgres://localhost/test",
  supabaseUrl: "https://example.supabase.co",
  supabaseServiceRoleKey: "test",
  port: 0,
};

describe("app", () => {
  it("boots and serves /health", async () => {
    const app = await buildApp(config);
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
    await app.close();
  });

  it("rejects an invalid ingest batch with 400", async () => {
    const app = await buildApp(config);
    const res = await app.inject({
      method: "POST",
      url: "/ingest/00000000-0000-0000-0000-000000000000",
      payload: { points: [{ seq: -1, recordedAt: "nope", lat: 999, lng: 0 }] },
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });
});
