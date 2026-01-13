import { NextRequest, NextResponse } from "next/server";
import { checkHoliday } from "@/app/helper/check-holiday";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const response = await checkHoliday(data.date);
    return NextResponse.json({ isHoliday: response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
