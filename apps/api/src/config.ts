import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
});

export interface Config {
  databaseUrl: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  port: number;
}

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  const parsed = schema.parse(env);
  return {
    databaseUrl: parsed.DATABASE_URL,
    supabaseUrl: parsed.SUPABASE_URL,
    supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY,
    port: parsed.PORT,
  };
}
