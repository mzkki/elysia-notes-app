import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import openapi from "@elysiajs/openapi";
import { jwtMiddleware } from "./modules/auth/middleware";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Notes App API",
          version: "0.0.1",
          contact: {
            name: "harismzkki",
            email: "08harismu@gmail.com",
            url: "https://linkedin.com/in/harismzkki",
          },
          description: "API documentation for the Notes App",
        },
        tags: [
          {
            name: "Authentication",
            description: "Endpoints related to user authentication",
          },
          {
            name: "Notes",
            description: "Endpoints related to notes management",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .onError(({ code, status, error }) => {
    console.error(`Error [${code}]:`, error);

    if (code === "NOT_FOUND")
      return status(404, { message: "Resource not found" });

    if (code === "INTERNAL_SERVER_ERROR")
      return status(500, { message: "Internal server error" });
  })
  .use(auth)
  .use(jwtMiddleware)
  .get(
    "/hello",
    () => {
      return { hello: "World" };
    },
    {
      isAuth: true,
      detail: {
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} bro`
);
