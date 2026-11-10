import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Config } from "../../config";

const gpsBatch = z.object({
  points: z
    .array(
      z.object({
        seq: z.number().int().nonnegative(),
        recordedAt: z.string().datetime(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        altitudeM: z.number().optional(),
        accuracyM: z.number().nonnegative().optional(),
        speedMps: z.number().nonnegative().optional(),
      }),
    )
    .min(1)
    .max(500),
});

export async function ingestRoutes(app: FastifyInstance, _config: Config) {
  // Slice 2 implements the insert ("on conflict do nothing" on
  // (session_id, seq)) and the Realtime broadcast. The contract is fixed now
  // so the mobile upload path can be built against it.
  app.post("/:sessionId", async (req, reply) => {
    const body = gpsBatch.safeParse(req.body);
    if (!body.success) {
      return reply.code(400).send({ ok: false, error: "invalid_batch" });
    }
    return reply.code(501).send({ ok: false, error: "not_implemented" });
  });
}
