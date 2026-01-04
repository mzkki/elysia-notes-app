import { Elysia } from "elysia";
import { auth } from "./modules/auth";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/hello", () => {
    return { hello: "World" };
  })
  .use(auth)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} bro`
);
