import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import openapi from "@elysiajs/openapi";

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
            name: "Users",
            description: "Endpoints related to user management",
          },
        ],
      },
    })
  )
  .get("/", () => "Hello Elysia", {
    detail: {
      hide: true,
    },
  })
  .get(
    "/hello",
    () => {
      return { hello: "World" };
    },
    { detail: { hide: true } }
  )
  .use(auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} bro`
);
