import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

import { Auth, JWTInstance } from "./service";
import { AuthModel } from "./model";

export const auth = new Elysia().group("/auth", (app) =>
  app
    // JWT Conf
    .use(jwt({ secret: "super-secret-key", name: "jwt" }))
    // Sign In Endpoint
    .post(
      "/sign-in",
      async ({ jwt, body, cookie: { session } }) => {
        const response = await Auth.signIn(body, jwt as JWTInstance);

        session.value = response.token;

        return response;
      },
      {
        body: AuthModel.signInBody,
        detail: {
          tags: ["Authentication"],
        },
        response: {
          200: AuthModel.signInResponse,
          401: AuthModel.signInInvalid,
        },
      }
    )
    // Sign Up Endpoint
    .post(
      "/sign-up",
      async ({ body }) => {
        const response = await Auth.signUp(body);
        return response;
      },
      {
        body: AuthModel.signUpBody,
        detail: {
          tags: ["Authentication"],
        },
        response: {
          200: AuthModel.signUpResponse,
          409: AuthModel.signUpInvalid,
        },
      }
    )
);
