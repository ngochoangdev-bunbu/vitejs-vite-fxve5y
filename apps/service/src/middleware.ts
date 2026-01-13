import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "./utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") ||
    pathname === "/api/misoca-auth-callback"
  ) {
    //userがadminユーザーか判定する処理
    const isAdmin = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec, {});
          const groups = session?.tokens?.idToken?.payload["cognito:groups"];
          return Array.isArray(groups) && groups.includes("ADMINS");
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    });
    if (isAdmin) {
      return response;
    }
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  return response;
}

export const config = {
  // /signIn signUp以外のすべてのパスを通る
  matcher: ["/((?!signIn|signUp|resetPassword|_next/static|_next/image|favicon.ico).*)"],
};
