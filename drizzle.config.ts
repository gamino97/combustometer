import type { Config } from "drizzle-kit";

export default {
  driver: "expo",
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dialect: "sqlite",
} satisfies Config;
