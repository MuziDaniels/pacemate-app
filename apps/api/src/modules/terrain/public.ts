// Public interface of the terrain module. The ONLY file other modules or app.ts
// may import from this directory. Implemented in its build-plan slice.
import type { FastifyPluginAsync } from "fastify";
import type { Config } from "../../config.js";

export function registerTerrain(_config: Config): FastifyPluginAsync {
  return async (app) => {
    app.get("/health", async () => ({ ok: true, module: "terrain" }));
  };
}
