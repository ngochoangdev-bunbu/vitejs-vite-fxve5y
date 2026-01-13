import { google } from "googleapis";
import { RoomType } from "@repo/common-utils/master";
import { FormBooking, FormReservation } from "@repo/common-utils/interfaces";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Event {
  roomTypeId?: number;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

const jwt = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/calendar"]
);

const calendar = google.calendar({ version: "v3", auth: jwt });

/**
 * フォームデータをEvents:insertで挿入するデータ形式に整形する
 *
 * @param reservation- フォームの予約情報
 * @param bookings- フォームの予約詳細情報
 * @returns Events:insertで挿入するデータ
 */
const formatFormDataOfMeeting = (reservation: FormReservation, bookings: FormBooking[]): Event[] => {
  let events: Event[] = [];
  for (const booking of bookings) {
    const startTime = booking.isFullDay ? booking.startTimeFullDay : booking.startTime;
    const endTime = booking.isFullDay ? booking.endTimeFullDay : booking.endTime;

    const startTimeISO = dayjs.tz(`${booking.date} ${startTime}`, "Asia/Tokyo").toISOString();
    const endTimeISO = dayjs.tz(`${booking.date} ${endTime}`, "Asia/Tokyo").toISOString();

    events.push({
      roomTypeId: booking.roomTypeId,
      summary: reservation.companyName || reservation.contactName,
      start: {
        dateTime: startTimeISO,
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: endTimeISO,
        timeZone: "Asia/Tokyo",
      },
    });
  }
  return events;
};
const formatFormDataOfHall = (reservation: FormReservation, bookings: FormBooking[]): Event[] => {
  let events: Event[] = [];
  for (const booking of bookings) {
    const startTime = booking.isFullDay ? booking.startTimeFullDay : booking.startTime;
    const endTime = booking.isFullDay ? booking.endTimeFullDay : booking.endTime;

    const startTimeISO = dayjs.tz(`${booking.date} ${startTime}`, "Asia/Tokyo").toISOString();
    const endTimeISO = dayjs.tz(`${booking.date} ${endTime}`, "Asia/Tokyo").toISOString();

    events.push({
      summary: reservation.companyName || reservation.contactName,
      start: {
        dateTime: startTimeISO,
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: endTimeISO,
        timeZone: "Asia/Tokyo",
      },
    });
  }
  return events;
};

/**
 * 会議室のカレンダーに予約可能か確認する
 *
 * @param events- すべての予約したい日時
 * @returns true:可能 false:不可能
 */
const isAvailableMeeting = async (events: Event[]): Promise<boolean> => {
  for (const event of events) {
    const calendarId =
      event.roomTypeId === RoomType.MeetingRoomSmall
        ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_SM
        : process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_MD;

    const calendarEvents = await calendar.events.list({
      calendarId,
      timeMin: event.start.dateTime,
      timeMax: event.end.dateTime,
    });
    if (calendarEvents.data.items && calendarEvents.data.items.length > 0) {
      return false;
    }
  }
  return true;
};

/**
 * ホールのカレンダーに予約可能か確認する
 *
 * @param events- すべての予約したい日時
 * @returns true:可能 false:不可能
 */
const isAvailableHall = async (events: Event[]): Promise<boolean> => {
  for (const event of events) {
    const calendarEvents = await calendar.events.list({
      calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HALL,
      timeMin: event.start.dateTime,
      timeMax: event.end.dateTime,
    });
    if (calendarEvents.data.items && calendarEvents.data.items.length > 0) {
      return false;
    }
  }
  return true;
};

/**
 * 会議室のカレンダーに予約を追加する
 *
 * @param reservation- フォームの予約情報
 * @param bookings- フォームの予約詳細情報
 * @returns カレンダーに追加したイベントID
 */
export const insertMeeting = async (reservation: FormReservation, bookings: FormBooking[]): Promise<string[]> => {
  const events = formatFormDataOfMeeting(reservation, bookings);
  if (!(await isAvailableMeeting(events))) {
    throw new Error("Already have a events.");
  }
  const addedEventIds: string[] = [];
  for (const event of events) {
    const calendarId =
      event.roomTypeId === RoomType.MeetingRoomSmall
        ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_SM
        : process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_MD;

    //予定の追加
    const addedEventInfo = await calendar.events.insert({
      auth: jwt,
      calendarId,
      requestBody: event,
    });
    if (!addedEventInfo.data.id) {
      throw new Error("Failed to insert events.");
    }
    addedEventIds.push(addedEventInfo.data.id);
  }
  return addedEventIds;
};

/**
 * ホールのカレンダーに予約を追加する
 *
 * @param reservation- フォームの予約情報
 * @param bookings- フォームの予約詳細情報
 * @returns カレンダーに追加したイベントID
 */
export const insertHall = async (reservation: FormReservation, bookings: FormBooking[]): Promise<string[]> => {
  const events = formatFormDataOfHall(reservation, bookings);
  if (!(await isAvailableHall(events))) {
    throw new Error("Already have a events.");
  }
  const addedEventIds: string[] = [];
  for (const event of events) {
    //予定の追加
    const addedEventInfo = await calendar.events.insert({
      auth: jwt,
      calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HALL,
      requestBody: event,
    });
    if (!addedEventInfo.data.id) {
      throw new Error("Failed to insert events.");
    }
    addedEventIds.push(addedEventInfo.data.id);
  }
  return addedEventIds;
};

/**
 * 会議室のカレンダーのイベントを削除する
 * @param eventId 削除するイベントのID
 * @param roomTypeId 会議室の部屋タイプID
 */
export const deleteMeeting = async (eventId: string, roomTypeId: number): Promise<void> => {
  const calendarId =
    roomTypeId === RoomType.MeetingRoomSmall
      ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_SM
      : process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_MD;

  await calendar.events.delete({
    auth: jwt,
    calendarId,
    eventId,
  });
};

/**
 * ホールのカレンダーのイベントを削除する
 * @param eventId 削除するイベントのID
 */
export const deleteHall = async (eventId: string): Promise<void> => {
  await calendar.events.delete({
    auth: jwt,
    calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HALL,
    eventId,
  });
};
