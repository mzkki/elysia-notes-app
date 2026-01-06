import { t } from "elysia";
import { db } from "../../database/model";

const { user: userInsert } = db.insert;
const { user: userSelect } = db.select;

export namespace AuthModel {
  export const signInBody = t.Object({
    email: userSelect.email,
    password: userSelect.password,
  });

  export const signUpBody = t.Object({
    email: userInsert.email,
    name: userInsert.name,
    password: userInsert.password,
  });

  export const refreshTokenBody = t.Object({
    refreshToken: t.String({ example: "dummy-refresh-token" }),
  });

  export const signOutBody = t.Object({
    refreshToken: t.String({ example: "dummy-refresh-token" }),
  });

  export const signInResponse = t.Object({
    accessToken: t.String({ example: "dummy-jwt-token" }),
    refreshToken: t.String({ example: "dummy-refresh-token" }),
    message: t.String({ example: "Sign in successful" }),
    user: t.Object({
      id: t.Number({ example: 1 }),
      name: t.String({ example: "John Doe" }),
      email: t.String({ example: "john.doe@mail.com" }),
    }),
  });

  export const signUpResponse = t.Object({
    message: t.String({ example: "User registered successfully" }),
  });

  export const refreshTokenResponse = t.Object({
    message: t.String({ example: "Token refreshed successfully" }),
    data: t.Object({
      accessToken: t.String({ example: "new-dummy-jwt-token" }),
      refreshToken: t.String({ example: "new-dummy-refresh-token" }),
    }),
  });

  export const signOutRepsonse = t.Object({
    message: t.String({ example: "Sign out successful" }),
  });

  export const signInInvalid = t.Object({
    message: t.String({
      example: "Invalid username or password",
    }),
  });

  export const signUpInvalid = t.Object({
    message: t.String({
      example: "User with this email already exists",
    }),
  });

  export const refreshTokenInvalid = t.Object({
    message: t.String({
      example: "Invalid or expired refresh token",
    }),
  });

  export type signInBody = typeof signInBody.static;
  export type signUpBody = typeof signUpBody.static;
  export type refreshTokenBody = typeof refreshTokenBody.static;
  export type signOutBody = typeof signOutBody.static;

  export type signInResponse = typeof signInResponse.static;
  export type signUpResponse = typeof signUpResponse.static;
  export type refreshTokenResponse = typeof refreshTokenResponse.static;
  export type signOutResponse = typeof signOutRepsonse.static;

  export type signInInvalid = typeof signInInvalid.static;
  export type signUpInvalid = typeof signUpInvalid.static;
  export type refreshTokenInvalid = typeof refreshTokenInvalid.static;
}
