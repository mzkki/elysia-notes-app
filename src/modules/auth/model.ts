import { t } from "elysia";

export namespace AuthModel {
  export const signInBody = t.Object({
    username: t.String(),
    password: t.String(),
  });

  export type signInBody = typeof signInBody.static;

  export const signInResponse = t.Object({
    token: t.String(),
    username: t.String(),
  });

  export type signInResponse = typeof signInResponse.static;

  export const signInInvalid = t.Object({
    message: t.String(),
  });
  export type signInInvalid = typeof signInInvalid.static;
}
