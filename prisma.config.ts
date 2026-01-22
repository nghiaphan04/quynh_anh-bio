import { defineConfig } from 'prisma/config';
import { config } from "dotenv";
config(); // load .env.local

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

