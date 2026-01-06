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

const refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();

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

    const accessToken = await jwt.sign({
      sub: String(user.id),
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 menit
    });

    const refreshToken = await jwt.sign({
      sub: String(user.id),
      type: "refresh",
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 hari
    });

    refreshTokens.set(refreshToken, {
      userId: String(user.id),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      message: "Sign in successful",
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
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

  static async refreshToken(refreshToken: string, jwt: JWTInstance) {
    const payload = await jwt.verify(refreshToken);

    if (!payload || payload.type !== "refresh") {
      throw status(401, {
        message: "Invalid or expired refresh token",
      });
    }

    const storedToken = refreshTokens.get(refreshToken);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      refreshTokens.delete(refreshToken);
      throw status(401, {
        message: "Invalid or expired refresh token",
      });
    }

    const [data] = await db
      .select({ user: table.user })
      .from(table.user)
      .where(eq(table.user.id, Number(payload.sub)));

    if (!data) {
      throw status(401, {
        message: "Invalid or expired refresh token",
      });
    }

    const newAccessToken = await jwt.sign({
      sub: String(data.user.id),
      email: data.user.email,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    });

    const newRefreshToken = await jwt.sign({
      sub: String(data.user.id),
      type: "refresh",
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    });

    refreshTokens.delete(refreshToken);
    refreshTokens.set(newRefreshToken, {
      userId: String(data.user.id),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    } as AuthModel.refreshTokenResponse;
  }

  static async logout(refreshToken: string) {
    refreshTokens.delete(refreshToken);
    return { message: "Logged out successfully" };
  }
}
