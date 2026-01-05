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
      note: createInsertSchema(table.note),
    },
    "insert"
  ),
  select: spreads(
    {
      user: createInsertSchema(table.user, {
        email: t.String({ format: "email" }),
      }),
      note: table.note,
    },
    "select"
  ),
} as const;
