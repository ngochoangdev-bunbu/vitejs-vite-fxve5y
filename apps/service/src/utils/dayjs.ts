import dayjs, { Dayjs } from "dayjs";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import "dayjs/locale/ja";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

dayjs.tz.setDefault("Asia/Tokyo");
dayjs.locale("ja");

/**
 * 日付をISO8601形式の文字列に変換する
 * @param date - 変換する日付（Dayjs、Date、または文字列形式）
 * @returns ISO8601形式の日付文字列
 */
export function getISO8601String(date: Dayjs | Date | string) {
  return dayjs(date).tz().format("YYYY-MM-DDTHH:mm:ssZ");
}

export default dayjs;
