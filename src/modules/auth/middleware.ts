import { Elysia } from "elysia";
import { jwtConfig } from "./jwt";

export type AuthUser = {
  id: string;
  email: string;
};

export const jwtMiddleware = new Elysia({
  name: "jwt-middleware",
})
  .use(jwtConfig)
  .derive({ as: "global" }, async ({ jwt, headers }) => {
    const authHeader = headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null as AuthUser | null };
    }

    const token = authHeader.slice(7);

    try {
      const payload = await jwt.verify(token);

      if (payload && payload.type !== "refresh") {
        const user = {
          id: payload.sub as string,
          email: payload.email as string,
        };
        return { user };
      }
    } catch (error) {
      console.log("JWT verification failed:", error);
    }

    return { user: null as AuthUser | null };
  })
  .macro({
    isAuth(enabled: boolean) {
      if (!enabled) return {};

      return {
        beforeHandle({ user, set }) {
          if (!user) {
            set.status = 401;
            return { success: false, message: "Unauthorized" };
          }
        },
      };
    },
  });
