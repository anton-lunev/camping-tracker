import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
