import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const jwtConfig = new Elysia({ name: "jwt-config" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "super-secret-key",
      exp: "15m", // default expiration
    })
  )
  .as("scoped");
