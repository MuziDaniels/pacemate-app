// Public interface of the ingestion module. The ONLY file other modules or
// app.ts may import from this directory.
import type { FastifyPluginAsync } from "fastify";
import type { Config } from "../../config.js";
import { ingestRoutes } from "./routes.js";

export function registerIngestion(config: Config): FastifyPluginAsync {
  return async (app) => {
    await ingestRoutes(app, config);
  };
}
