"use server";

import { createClient } from "@/utils/supabase/common";

export async function getTrackers() {
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("active", true);
  return subs ?? [];
}
