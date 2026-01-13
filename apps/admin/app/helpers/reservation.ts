import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { ReservationRecord } from "@repo/common-utils/interfaces";
import { mRoomType } from "@repo/common-utils/master";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const client = generateClient<Schema>();

export async function getReservations(estimatesId?: string): Promise<ReservationRecord[]> {
  // DynamoDBからデータを取得する
  const reservations = await client.models.Reservation.list();
  const estimates = await client.models.Estimate.list(
    estimatesId ? { filter: { estimates_id: { eq: estimatesId } } } : undefined
  );

  // データ整形処理
  const formattedData: ReservationRecord[] = [];
  for (const item of reservations.data) {
    const estimate = estimates.data.find((record) => record.id === item.estimates_id);

    const record: ReservationRecord = {
      id: item.id,
      estimatesId: item.estimates_id,
      mRoomTypeId: item.m_room_type_id,
      mRoomTypeName: mRoomType.find(({ id }) => id === item.m_room_type_id)?.name ?? "",
      checkIn: item.check_in,
      checkOut: item.check_out,
      isAllDay: item.is_all_day,
      baseFee: item.base_fee,
      companions: item.companions,
      companyName: estimate?.company_name ?? "",
      contactName: item.contact_name ?? "",
      contactEmail: item.contact_email ?? "",
      canceledDate: item.canceled_date ?? "",
      googleCalendarEventId: item.google_calendar_event_id ?? "",
      owner: item.owner ?? "",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    formattedData.push(record);
  }

  return formattedData;
}

export async function getReservationDetails(id: string): Promise<ReservationRecord> {
  // DynamoDBからデータを取得する
  const details = await client.models.Reservation.get({ id });
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

  return formattedData;
}

interface ReservationInfo {
  id?: string;
  roomTypeId?: number;
  googleCalendarEventId?: string;
}

export async function cancelReservation(reservations: ReservationInfo[]): Promise<void> {
  for (const item of reservations) {
    if (!item.id) continue;

    // Google Calendarイベントの削除
    if (item.googleCalendarEventId) {
      const response = await fetch("/api/calendar/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomTypeId: item.roomTypeId, googleCalendarEventId: item.googleCalendarEventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "unknown error");
      }
    }

    // DynamoDB更新処理
    await client.models.Reservation.update({
      id: item.id,
      canceled_date: dayjs().utc().format(),
    });

    // メール送信
    for (const item of reservations) {
      if (!item.id) continue;
      // await sendMailWithReservationId(3, item.id);
      // TODO: sendmail
    }
  }
}
