import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: { url: process.env.SQLITE_URL ?? "file:./data/msm-cms.db" },
} satisfies Config;
