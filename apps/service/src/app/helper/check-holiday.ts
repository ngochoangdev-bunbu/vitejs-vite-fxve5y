import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * dateが祝日の場合にtrueを返す
 *
 * @param date - yyyy-mm-ddのフォーマットのjstの日付
 * @returns 祝日の場合はtrueを返す
 */
import { google } from "googleapis";

export const checkHoliday = async (checkIn: dayjs.Dayjs): Promise<boolean> => {
  const jwt = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar"],
  );

  const calendar = google.calendar({ version: "v3", auth: jwt });

  try {
    //日本の祝日が登録されたグーグルカレンダーから、指定した日を取得する
    const date = checkIn.tz("Asia/Tokyo").format("YYYY-MM-DD");
    const events = await calendar.events.list({
      calendarId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HOLIDAY,
      timeMin: `${date}T00:00:00+09:00`,
      timeMax: `${date}T23:59:59+09:00`,
      timeZone: "Asia/Tokyo",
      singleEvents: true,
    });

    //イベントがある場合は祝日
    if (events.data.items && events.data.items.length > 0) {
      //祭日を除外
      const filteredEvents = events.data.items.filter(
        (event) => event.description && !event.description.startsWith("祭日"),
      );
      return filteredEvents.length > 0;
    }
    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
