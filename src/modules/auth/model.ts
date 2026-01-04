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

  export const signInResponse = t.Object({
    token: t.String({ example: "dummy-jwt-token" }),
    email: t.String({ example: "name@mail.com" }),
  });

  export const signUpResponse = t.Object({
    message: t.String({ example: "User registered successfully" }),
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

  export type signInBody = typeof signInBody.static;
  export type signUpBody = typeof signUpBody.static;

  export type signInResponse = typeof signInResponse.static;
  export type signUpResponse = typeof signUpResponse.static;

  export type signInInvalid = typeof signInInvalid.static;
  export type signUpInvalid = typeof signUpInvalid.static;
}
