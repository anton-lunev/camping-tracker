import { createClient as create } from "@supabase/supabase-js";

export function createClient() {
  return create(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
