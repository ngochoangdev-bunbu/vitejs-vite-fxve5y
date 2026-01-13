import { checkHoliday } from "./check-holiday";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RoomType, mOptionType, mTimeBasedFee, mUsageBasedFee } from "@repo/common-utils/master";
import { FormBooking } from "@repo/common-utils/interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * 平日か判定する
 *
 * @param checkIn 利用予定日のDayjsオブジェクト(UTC)
 * @returns 平日：true 土日祝日：false
 */
const isWeekdayInJST = async (checkIn: dayjs.Dayjs): Promise<boolean> => {
  //土日か判定
  const dayOfWeek = checkIn.format("dddd");
  if (dayOfWeek === "Saturday" || dayOfWeek === "Sunday") {
    return false;
  }
  //祝日か判定
  if (await checkHoliday(checkIn)) {
    return false;
  }
  return true;
};

/**
 * 消費税計算
 *
 * @param price 税抜きの料金
 * @returns 税込みの料金
 */
export const calcTotalTax = (price: number): number => {
  const taxRate: number = Number(process.env.NEXT_PUBLIC_TAX_RATE);
  const total = price * (1 + taxRate / 100);

  return Math.floor(total);
};

/**
 * 会議室の税抜き基本料金を計算する
 *
 * @param checkIn - チェックイン予定時間のDayjsオブジェクト(UTC)
 * @param checkOut - チェックアウト予定時間のDayjsオブジェクト(UTC)
 * @returns 会議室の税抜き基本料金
 */
export const meetingBaseFeeCalculation = async (
  roomTypeId: number,
  checkIn: dayjs.Dayjs,
  checkOut: dayjs.Dayjs,
): Promise<number> => {
  const isWeekday = await isWeekdayInJST(checkIn);
  //会議室の料金を取得する
  const mUsageBasedFeeData = mUsageBasedFee.find(
    (item) =>
      item.m_room_type_id === roomTypeId && item.is_weekday === isWeekday,
  );

  if (!mUsageBasedFeeData) throw new Error("No usage based fee data found");

  const usageTime = checkOut.diff(checkIn, "hour", true);
  const fee = mUsageBasedFeeData.hourly_fee * usageTime;
  return Math.min(fee, mUsageBasedFeeData.max_fee ?? fee);
};

/**
 * ホールの税抜き基本料金を計算する
 *
 * @param checkIn - チェックイン予定時間のDayjsオブジェクト(UTC)
 * @param checkOut - チェックアウト予定時間のDayjsオブジェクト(UTC)
 * @returns ホールの税抜き基本料金
 */
export const hallBaseFeeCalculation = async (
  checkIn: dayjs.Dayjs,
  checkOut: dayjs.Dayjs,
): Promise<number> => {
  //ホールの料金を取得する
  const mTimeBasedFeeData = mTimeBasedFee.filter(
    (item) => item.m_room_type_id === RoomType.Hall,
  );

  const isWeekday = await isWeekdayInJST(checkIn);

  const jstDate = checkIn.format("YYYY-MM-DD");
  const filteredData = mTimeBasedFeeData.filter((item) => {
    const checkInTime = dayjs.tz(
      `${jstDate} ${item.jst_check_in_time}`,
      "Asia/Tokyo",
    );
    const checkOutTime = dayjs.tz(
      `${jstDate} ${item.jst_check_out_time}`,
      "Asia/Tokyo",
    );
    return (
      item.is_weekday === isWeekday &&
      (checkInTime.isSame(checkIn) || checkInTime.isAfter(checkIn)) &&
      (checkOutTime.isSame(checkOut) || checkOutTime.isBefore(checkOut))
    );
  });

  const fee = filteredData.reduce((sum, current) => sum + current.fee, 0);

  const HALL_WEEKDAY_MAX_FEE = 25000;
  const HALL_HOLIDAY_MAX_FEE = 32500;

  const maxFee = isWeekday ? HALL_WEEKDAY_MAX_FEE : HALL_HOLIDAY_MAX_FEE;
  return Math.min(fee, maxFee);
};

/**
 * 料金計算
 * ※/api/total-fee-calculationのPOST処理代替
 * @param bookings
 * @returns totalFee: 総計(税込み)
 */
export const calcHallTotalFee = async (
  bookings: FormBooking[],
): Promise<number> => {
  let totalFee = 0;

  const mOptionData = mOptionType.filter(
    (item) => item.m_room_type_id === RoomType.Hall,
  );

  for (const booking of bookings) {
    if (!booking.date) continue;

    const startTime = booking.isFullDay
      ? booking.startTimeFullDay
      : booking.startTime;
    const endTime = booking.isFullDay
      ? booking.endTimeFullDay
      : booking.endTime;

    const startDateTimeISO = dayjs
      .tz(`${booking.date} ${startTime}`, "Asia/Tokyo")
      .toISOString();
    const endDateTimeISO = dayjs
      .tz(`${booking.date} ${endTime}`, "Asia/Tokyo")
      .toISOString();

    const baseFee = await hallBaseFeeCalculation(
      dayjs.utc(startDateTimeISO),
      dayjs.utc(endDateTimeISO),
    );

    totalFee += baseFee;

    let optionFee = 0;
    if (!booking.options || booking.options.length < 1) continue;
    for (const option of booking.options) {
      const mOption = mOptionData.find(({ id }) => id === option.id);
      if (!mOption) {
        throw new Error(
          "[calcHallTotalFee] no option data. mOptionsId:" + option.id,
        );
      }
      optionFee += mOption.option_fee * option.number;
    }

    totalFee += optionFee;
  }

  return calcTotalTax(totalFee);
};

/**
 * 料金計算
 * ※/api/total-fee-calculationのPOST処理代替
 * @param bookings
 * @returns totalFee: 総計(税込み)
 */
export const calcMeetingTotalFee = async (
  bookings: FormBooking[],
): Promise<number> => {
  let totalFee = 0;
  for (const booking of bookings) {
    if (!booking.date) continue;

    const startTime = booking.isFullDay
      ? booking.startTimeFullDay
      : booking.startTime;
    const endTime = booking.isFullDay
      ? booking.endTimeFullDay
      : booking.endTime;

    const startDateTimeISO = dayjs
      .tz(`${booking.date} ${startTime}`, "Asia/Tokyo")
      .toISOString();
    const endDateTimeISO = dayjs
      .tz(`${booking.date} ${endTime}`, "Asia/Tokyo")
      .toISOString();

    const fee = await meetingBaseFeeCalculation(
      booking.roomTypeId,
      dayjs.utc(startDateTimeISO),
      dayjs.utc(endDateTimeISO),
    );

    totalFee += fee;
  }

  return calcTotalTax(totalFee);
};
