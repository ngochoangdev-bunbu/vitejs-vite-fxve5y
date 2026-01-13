import { NextRequest, NextResponse } from "next/server";

/**
 * Misocaのトークンを取得するAPI
 */
export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get("token");
    if (!tokenCookie) {
      throw new Error("invalid misoca token");
    }
    const token = tokenCookie.value;
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
