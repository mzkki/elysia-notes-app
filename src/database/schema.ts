import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const table = {
  user,
} as const;

export type Table = typeof table;
