import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FormBooking, FormReservation } from "@repo/common-utils/interfaces";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { RoomType } from "@repo/common-utils/master";
import { sendReservationCompletedEmail } from "./mail";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function createReservationMeeting(
  reservation: FormReservation,
  bookings: FormBooking[],
  totalFee: number,
  reCaptchaToken: string
) {
  const response = await fetch("/api/reservations/meeting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservation, bookings, reCaptchaToken }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message ?? "unknown error");
  }

  const { eventIds } = await response.json();

  const client = generateClient<Schema>();
  const estimateData = await client.models.Estimate.create(
    {
      name: reservation.contactName,
      company_name: reservation.companyName,
      estimate_name: reservation.recipientName,
      email: reservation.email,
      tel: reservation.tel,
      payment_method: reservation.paymentMethod,
      message: reservation.contactNote,
    },
    // TODO: ログインユーザーif文対応
    { authMode: "iam" }
  );

  if (!estimateData.data) {
    throw new Error("Failed to create estimate");
  }

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const startTime = booking.isFullDay ? booking.startTimeFullDay : booking.startTime;
    const endTime = booking.isFullDay ? booking.endTimeFullDay : booking.endTime;
    const startTimeISO = dayjs.tz(`${booking.date} ${startTime}`, "Asia/Tokyo").toISOString();
    const endTimeISO = dayjs.tz(`${booking.date} ${endTime}`, "Asia/Tokyo").toISOString();

    const reservationRes = await client.models.Reservation.create(
      {
        estimates_id: estimateData.data.id,
        check_in: startTimeISO,
        check_out: endTimeISO,
        is_all_day: booking.isFullDay,
        companions: booking.numberOfParticipants,
        contact_name: booking.personInCharge,
        contact_email: booking.personInChargeEmail,
        google_calendar_event_id: eventIds[i],
        m_room_type_id: booking.roomTypeId,
        base_fee: totalFee, // 一旦合計金額（税込）を保存する
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );

    if (!reservationRes.data) {
      throw new Error("Failed to create reservation");
    }
  }

  // 利用用途
  for (const id of reservation.purposes) {
    await client.models.UsagePurpose.create(
      {
        estimate_id: estimateData.data.id,
        m_usage_purpose_id: Number(id),
        other: reservation.purposesOtherChecked ? reservation.purposesOtherText : null,
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );
  }
  // アンケート
  for (const id of reservation.survey) {
    await client.models.Survey.create(
      {
        estimate_id: estimateData.data.id,
        m_survey_id: Number(id),
        other: reservation.surveyOtherChecked ? reservation.surveyOtherText : null,
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );
  }

  // 予約完了メール送信
  await sendReservationCompletedEmail({
    // user_id: reservation.userId,
    room_type_id: RoomType.MeetingRoomSmall,
    contact_name: reservation.contactName,
    company_name: reservation.companyName,
    recipient_name: reservation.recipientName,
    email: reservation.email,
    tel: reservation.tel,
    payment_method: reservation.paymentMethod,
    contact_note: reservation.contactNote,
    // purposes: purposeListData,
    // survey: surveyListData,
  });
}

export async function createReservationHall(
  reservation: FormReservation,
  bookings: FormBooking[],
  totalFee: number,
  reCaptchaToken: string
) {
  const response = await fetch("/api/reservations/hall", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reservation, bookings, reCaptchaToken }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message ?? "unknown error");
  }

  const { eventIds } = await response.json();

  const client = generateClient<Schema>();
  const estimateData = await client.models.Estimate.create(
    {
      name: reservation.contactName,
      company_name: reservation.companyName,
      estimate_name: reservation.recipientName,
      email: reservation.email,
      tel: reservation.tel,
      payment_method: reservation.paymentMethod,
      message: reservation.contactNote,
    },
    // TODO: ログインユーザーif文対応
    { authMode: "iam" }
  );

  if (!estimateData.data) {
    throw new Error("Failed to create estimate");
  }

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const startTime = booking.isFullDay ? booking.startTimeFullDay : booking.startTime;
    const endTime = booking.isFullDay ? booking.endTimeFullDay : booking.endTime;
    const startTimeISO = dayjs.tz(`${booking.date} ${startTime}`, "Asia/Tokyo").toISOString();
    const endTimeISO = dayjs.tz(`${booking.date} ${endTime}`, "Asia/Tokyo").toISOString();

    const reservationRes = await client.models.Reservation.create(
      {
        estimates_id: estimateData.data.id,
        check_in: startTimeISO,
        check_out: endTimeISO,
        is_all_day: booking.isFullDay,
        companions: booking.numberOfParticipants,
        contact_name: booking.personInCharge,
        contact_email: booking.personInChargeEmail,
        google_calendar_event_id: eventIds[i],
        m_room_type_id: booking.roomTypeId,
        base_fee: totalFee, // 一旦合計金額（税込）を保存する
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );

    if (!reservationRes.data) {
      throw new Error("Failed to create reservation");
    }

    for (const option of booking.options ?? []) {
      await client.models.Option.create(
        {
          reservation_id: reservationRes.data.id,
          m_option_id: option.id,
          quantity: option.number,
        },
        // TODO: ログインユーザーif文対応
        { authMode: "iam" }
      );
    }
  }

  // 利用用途
  for (const id of reservation.purposes) {
    await client.models.UsagePurpose.create(
      {
        estimate_id: estimateData.data.id,
        m_usage_purpose_id: Number(id),
        other: reservation.purposesOtherChecked ? reservation.purposesOtherText : null,
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );
  }
  // アンケート
  for (const id of reservation.survey) {
    await client.models.Survey.create(
      {
        estimate_id: estimateData.data.id,
        m_survey_id: Number(id),
        other: reservation.surveyOtherChecked ? reservation.surveyOtherText : null,
      },
      // TODO: ログインユーザーif文対応
      { authMode: "iam" }
    );
  }

  // 予約完了メール送信
  await sendReservationCompletedEmail({
    // user_id: reservation.userId,
    room_type_id: RoomType.Hall,
    contact_name: reservation.contactName,
    company_name: reservation.companyName,
    recipient_name: reservation.recipientName,
    email: reservation.email,
    tel: reservation.tel,
    payment_method: reservation.paymentMethod,
    contact_note: reservation.contactNote,
    // purposes: purposeListData,
    // survey: surveyListData,
  });
}
