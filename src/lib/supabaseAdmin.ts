import { createClient } from "@supabase/supabase-js";

function getEnvOrThrow(name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const supabaseAdmin = createClient(
  getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL"),
  getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY"),
);
