import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth_url = process.env.NEXT_PUBLIC_MISOCA_AUTH_ENDPOINT;
  const client_id = process.env.NEXT_PUBLIC_MISOCA_APPLICATION_ID;
  const client_secret = process.env.MISOCA_SECRET;
  const origin = process.env.NEXT_PUBLIC_URL_ORIGIN;

  // クッキーから値を取得
  const refreshTokenCookie = request.cookies.get("refresh_token");
  const refreshToken: string | undefined = refreshTokenCookie?.value;

  try {
    if (!refreshToken) {
      return NextResponse.json({ message: "Failed to refresh" });
    } else {
      if (!client_id || !client_secret) {
        throw new Error("Client ID or Client Secret is missing");
      }

      const response = await fetch(`${auth_url}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id,
          client_secret,
        }),
      });

      if (!response.ok) {
        return NextResponse.json({
          message: "Failed to refresh",
        });
      }

      const data = await response.json();
      const { access_token, refresh_token } = data;

      const oneDayInMilliseconds = 86400000; // 24 * 60 * 60 * 1000
      const expiryDate = new Date(Date.now() + oneDayInMilliseconds);

      const res = NextResponse.redirect(`${origin}/admin/admin-users`);
      res.cookies.set("token", access_token, {
        path: "/",
        httpOnly: true,
        expires: expiryDate,
      });
      // リフレッシュトークンの期限(30日)
      const refreshTokenExpiryDate = new Date(Date.now() + 30 * oneDayInMilliseconds);
      res.cookies.set("refresh_token", refresh_token, {
        path: "/",
        httpOnly: true,
        expires: refreshTokenExpiryDate,
      });

      return res;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
