import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '../admin/app/utils/amplifyServerUtils';

// 認証が不要なパス
const publicPaths = ['/signIn', '/resetPassword'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 認証が不要なパスはそのまま通す
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    const isAdmin = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec, {});
                const groups = session?.tokens?.idToken?.payload["cognito:groups"];
                return Array.isArray(groups) && groups.includes("ADMINS");
            } catch (error) {
                return false;
            }
        },
    });

    if (isAdmin) {
        return NextResponse.next();
    } else {
        // 認証情報がない場合、サインインページにリダイレクト
        const signInUrl = new URL('/signIn', request.url);
        return NextResponse.redirect(signInUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|_next/images|/images|favicon.ico).*)',
    ],
};