import { status } from "elysia";

import type { AuthModel } from "./model";
import { db } from "../../database";
import { table } from "../../database/schema";
import { eq } from "drizzle-orm";
import { JWTPayloadSpec } from "@elysiajs/jwt";

export interface JWTInstance {
  sign: (
    payload: Record<string, string | number> & JWTPayloadSpec
  ) => Promise<string>;
  verify: (
    token: string
  ) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
}
export abstract class Auth {
  static async signIn(
    { email, password }: AuthModel.signInBody,
    jwt: JWTInstance
  ) {
    const [data] = await db
      .select({ user: table.user })
      .from(table.user)
      .where(eq(table.user.email, email));

    if (!data) {
      throw status(401, {
        message: "Invalid username or password",
      });
    }

    const { user } = data;

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      throw status(401, {
        message: "Invalid username or password",
      });
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await jwt.sign(jwtPayload);

    return {
      token,
      email: user.email,
    } as AuthModel.signInResponse;
  }

  static async signUp({ email, name, password }: AuthModel.signUpBody) {
    const [existingUser] = await db
      .select({ user: table.user })
      .from(table.user)
      .where(eq(table.user.email, email));

    if (existingUser) {
      throw status(409, {
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await Bun.password.hash(password);

    await db
      .insert(table.user)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    return {
      message: "User registered successfully",
    } as AuthModel.signUpResponse;
  }
}
