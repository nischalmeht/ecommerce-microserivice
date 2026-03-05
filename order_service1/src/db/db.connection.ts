// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';

// const DB = drizzle(process.env.DATABASE_URL!);
// export default DB
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { DB_URL } from "../config";

const pool = new Pool({
  connectionString: DB_URL,
});

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });