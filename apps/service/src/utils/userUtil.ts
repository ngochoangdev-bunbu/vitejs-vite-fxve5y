import { AuthUser } from "aws-amplify/auth";
import { runWithAmplifyServerContext } from "./amplifyServerUtils";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

// ログインしたユーザーを取得。ログインなしの場合、nullを返す。
export const getCurrentServerUser = async (): Promise<AuthUser | null> => {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    return user;
  } catch (error) {
    // No authenticated user found on the server.
    return null;
  }
};
