import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.error("🔴 no database URL");
}

const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema });
