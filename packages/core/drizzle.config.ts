import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config({
  path: '../../.env',
})
export default defineConfig({
 schema: "./src/db/schema/*",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
})