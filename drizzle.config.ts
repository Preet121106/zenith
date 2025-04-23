import { defineConfig } from "drizzle-kit";
import { BaseEnvironment } from "./configs/BaseEnvironment";

const env = new BaseEnvironment();

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./schema/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: 'postgresql://zenithai_owner:npg_6Kdmntzo9AxH@ep-curly-dream-a414ncgg.us-east-1.aws.neon.tech/zenithai?sslmode=require',
  },
});
