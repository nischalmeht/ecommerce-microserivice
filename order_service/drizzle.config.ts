// import { defineConfig } from "drizzle-kit";
// import { DB_URL } from "./src/config";

// export default defineConfig({
//   schema: "./src/db/schema/*",
//   out: "./src/db/migrations",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: DB_URL as string,
//   },
//   verbose: true,
//   strict: true,
// });

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
out: "./src/db/migrations",
  schema: "./src/db/schema/*",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
