import { type NextRequest, NextResponse } from "next/server";
import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { ReservationRecord } from "@repo/common-utils/interfaces";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const estimatesId = searchParams.get("estimatesId");
    //if (!estimatesId) throw new Error("invalid estimates id");

    // DynamoDBからデータを取得する
    const reservations = await cookieBasedClient.models.Reservation.list(
      estimatesId
        ? {
          filter: {
            estimates_id: { eq: estimatesId },
          },
        }
        : undefined,
    );

    const estimates = await cookieBasedClient.models.Estimate.list();

    const mRoomTypes = await cookieBasedClient.models.MRoomType.list();

    // データ整形処理
    const formattedData: ReservationRecord[] = [];
    for (const item of reservations.data) {
      const estimate = estimates.data.find(
        (record) => record.id === item.estimates_id,
      );

      const record: ReservationRecord = {
        id: item.id,
        estimatesId: item.estimates_id,
        mRoomTypeId: item.m_room_type_id,
        mRoomTypeName:
          mRoomTypes.data.find((i) => i.id === item.m_room_type_id)?.name || "",
        checkIn: item.check_in,
        checkOut: item.check_out,
        isAllDay: item.is_all_day,
        baseFee: item.base_fee,
        companions: item.companions,
        companyName: estimate?.company_name || "",
        contactName: item.contact_name || "",
        contactEmail: item.contact_email || "",
        canceledDate: item.canceled_date || "",
        googleCalendarEventId: item.google_calendar_event_id || "",
        owner: item.owner || "",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      formattedData.push(record);
    }

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
