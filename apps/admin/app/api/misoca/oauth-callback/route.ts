import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  const auth_uri = process.env.NEXT_PUBLIC_MISOCA_AUTH_ENDPOINT;
  const client_id = process.env.NEXT_PUBLIC_MISOCA_APPLICATION_ID;
  const client_secret = process.env.MISOCA_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_MISOCA_REDIRECT_URL;
  const origin = process.env.NEXT_PUBLIC_URL_ORIGIN;

  try {
    const response = await fetch(`${auth_uri}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    const data = await response.json();
    const { access_token, refresh_token } = data;
    const res = NextResponse.redirect(`${origin}/dashboard`);
    const oneDayInMilliseconds = 86400000; // 24 * 60 * 60 * 1000
    const expiryDate = new Date(Date.now() + oneDayInMilliseconds);
    const refreshTokenExpiryDate = new Date(Date.now() + 30 * oneDayInMilliseconds);
    res.cookies.set("token", access_token, {
      path: "/",
      httpOnly: true,
      expires: expiryDate,
    });
    res.cookies.set("refresh_token", refresh_token, {
      path: "/",
      httpOnly: true,
      expires: refreshTokenExpiryDate,
    });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
