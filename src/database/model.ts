import { createInsertSchema } from "drizzle-typebox";
import { table } from "./schema";
import { spreads } from "./utils";
import { t } from "elysia";

export const db = {
  insert: spreads(
    {
      user: createInsertSchema(table.user, {
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 }),
      }),
    },
    "insert"
  ),
  select: spreads(
    {
      user: createInsertSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
    },
    "select"
  ),
} as const;
