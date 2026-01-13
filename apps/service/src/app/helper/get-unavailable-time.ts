import { calendar_v3 } from "googleapis";

/**
 * 0.5刻みの時間を"HH:MM"形式に変換
 *
 * @param time - 0.5刻みの時間　例：9,10.5
 * @returns "HH:MM"形式の時間　例："09:00","10:30"
 */
export const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
};

/**
 * 予定一覧から利用不可な時間一覧に変換
 *
 * @param events - 予定一覧　例： [ { start: { dateTime: '2024-07-31T09:00:00+09:00',... }, end: { dateTime: '2024-07-31T10:00:00+09:00',... }, } , ... ]
 * @returns 利用不可な時間一覧　例：[ [ '09:00', '09:30' ], [ '10:00', '10:30' ] ]
 */
export const getUnavailableTime = (
  events: calendar_v3.Schema$Event[],
): string[][] => {
  const unavailableStartTimes = [];
  const unavailableEndTimes = [];
  for (const event of events) {
    const eventStart = event.start && event.start.dateTime;
    const eventEnd = event.end && event.end.dateTime;
    if (!eventStart || !eventEnd) {
      return [[], []];
    }
    const startTime: string[] = eventStart.split("T")[1].split(":");
    let startHour = Number(startTime[0]);
    const startMinite = Number(startTime[1]);
    if (startMinite === 30) {
      startHour += 0.5;
    }
    const endTime: string[] = eventEnd.split("T")[1].split(":");
    let endHour = Number(endTime[0]);
    const endMinite = Number(endTime[1]);
    if (endMinite === 30) {
      endHour += 0.5;
    }
    let unavailableStartTime = Math.max(startHour - 0.5, 9);
    while (unavailableStartTime <= endHour - 0.5) {
      unavailableStartTimes.push(formatTime(unavailableStartTime));
      unavailableStartTime += 0.5;
    }
    let unavailableEndTime = Math.max(startHour + 0.5, 10);
    while (unavailableEndTime <= endHour + 0.5) {
      unavailableEndTimes.push(formatTime(unavailableEndTime));
      unavailableEndTime += 0.5;
    }
  }
  return [unavailableStartTimes, unavailableEndTimes];
};
