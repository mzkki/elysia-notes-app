import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  max: 10,
});

const startup = async () => {
  await client`SELECT 1`;
  console.log("Database connected");
};

startup().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

export const db = drizzle(client, { schema });
