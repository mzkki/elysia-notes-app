import { status } from "elysia";

import type { AuthModel } from "./model";

export abstract class Auth {
  static async signIn({ username, password }: AuthModel.signInBody) {
    // Dummy implementation
    if (username === "admin" && password === "password") {
      return {
        token: "dummy-jwt-token",
        username: "admin",
      };
    } else {
      throw status(401, {
        message: "Invalid username or password",
      } as AuthModel.signInInvalid);
    }
  }
}
