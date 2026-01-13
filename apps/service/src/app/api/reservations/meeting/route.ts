import { type NextRequest, NextResponse } from "next/server";
import { ReCaptchaCheck } from "@/app/helper/recaptcha-check";
import { calendarHelper } from "@repo/common-utils/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FormBooking, FormReservation } from "@repo/common-utils/interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);

type RequestBody = {
  reservation: FormReservation;
  bookings: FormBooking[];
  reCaptchaToken: string;
};

export async function POST(request: NextRequest) {
  // フォームデータの取得
  const { reservation, bookings, reCaptchaToken }: RequestBody = await request.json();

  try {
    /*
      google reCAPTCHAにtokenの有効性のチェック
    */
    const success = await ReCaptchaCheck(reCaptchaToken);
    if (!success) {
      throw new Error("invalid Token");
    }
    /*
      google calendarに予定の追加
    */
    const eventIds = await calendarHelper.insertMeeting(reservation, bookings);

    /*
      レスポンス
    */
    return NextResponse.json({ eventIds }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
