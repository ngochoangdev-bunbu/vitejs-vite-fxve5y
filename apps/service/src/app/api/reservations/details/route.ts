import { type NextRequest, NextResponse } from "next/server";
import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { ReservationRecord } from "@/interfaces/reservation-record";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const id = searchParams.get("id");
    if (!id) throw new Error("invalid reservation id");

    // DynamoDBからデータを取得する
    const details = await cookieBasedClient.models.Reservation.get({ id });

    if (!details.data) throw new Error("no data");

    // データ整形処理
    const formattedData: ReservationRecord = {
      id: details.data.id,
      checkIn: details.data.check_in,
      checkOut: details.data.check_out,
      isAllDay: details.data.is_all_day,
      companions: details.data.companions,
      contactName: details.data.contact_name || "",
      contactEmail: details.data.contact_email || "",
      createdAt: details.data.createdAt,
      updatedAt: details.data.updatedAt,
      canceledDate: details.data.canceled_date || "",
      estimatesId: details.data.estimates_id,
      mRoomTypeId: details.data.m_room_type_id,
      baseFee: details.data.base_fee,
      owner: details.data.owner || "",
      googleCalendarEventId: details.data.google_calendar_event_id || "",
      companyName: "",
      mRoomTypeName: "",
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
