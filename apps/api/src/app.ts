import Fastify from "fastify";
import type { Config } from "./config";
import { registerIngestion } from "./modules/ingestion/public";
import { registerSessions } from "./modules/sessions/public";
import { registerTerrain } from "./modules/terrain/public";
import { registerCoach } from "./modules/coach/public";

export async function buildApp(config: Config) {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ ok: true }));

  // Modules register their own routes under their own prefix and own their
  // own tables. Cross-module calls go through each module's public.ts only.
  await app.register(registerIngestion(config), { prefix: "/ingest" });
  await app.register(registerSessions(config), { prefix: "/sessions" });
  await app.register(registerTerrain(config), { prefix: "/terrain" });
  await app.register(registerCoach(config), { prefix: "/coach" });

  return app;
}
