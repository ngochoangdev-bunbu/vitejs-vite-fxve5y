"use client";

import DetailList, { DetailListData } from "../../../components/table/DetailList";
import { ReservationRecord } from "@repo/common-utils/interfaces";
import { Suspense, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import clsx from "clsx";
import Spinner from "../../../components/common/Spinner";
import { cancelReservation, getReservationDetails } from "../../../helpers/reservation";

dayjs.extend(utc);
dayjs.extend(timezone);

type ReservationsDetailsContentProps = {
  id: string;
};

function ReservationsDetailsContent({ id }: ReservationsDetailsContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DetailListData[]>([]);
  const [cancelable, setCancelable] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  const [details, setDetails] = useState<ReservationRecord | null>(null);
  //let details: ReservationRecord | null = null;

  const formatDate = (value: string): string => {
    return value ? dayjs(value).tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss") : "";
  };

  const fetchDetails = useCallback(async () => {
    try {
      const details = await getReservationDetails(id);

      const listData: DetailListData[] = [
        {
          name: "開始日時",
          value: formatDate(details.checkIn),
        },
        { name: "終了日時", value: formatDate(details.checkOut) },
        {
          name: "1日コース",
          value: (
            <input
              type="checkbox"
              checked={details.isAllDay}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              disabled
            />
          ),
        },
        { name: "利用予定人数（オプション）", value: details.companions },
        { name: "担当者", value: details.contactName },
        { name: "担当者メールアドレス", value: details.contactEmail },
        {
          name: "受付日時",
          value: formatDate(details.createdAt),
        },
        {
          name: "キャンセル日時",
          value: formatDate(details.canceledDate),
        },
      ];

      setData(listData);
      setCancelable(details.canceledDate ? true : false);
      setDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleCancel = async () => {
    if (!details) return;
    if (details.canceledDate) return;

    try {
      setIsCanceling(true);
      setCancelable(false);
      const id = details.id;
      const roomTypeId = details.mRoomTypeId;
      const googleCalendarEventId = details.googleCalendarEventId;

      await cancelReservation([{ id, roomTypeId, googleCalendarEventId }]);
      await fetchDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className={clsx("relative")}>
      {isCanceling && (
        <div className={clsx("absolute", "flex size-full items-center justify-center")}>
          <Spinner className="size-16" />
        </div>
      )}
      <DetailList data={data}>予約詳細</DetailList>
      {isLoading ? null : (
        <div className="mt-5 flex justify-between">
          <div className="flex">
            <a
              href="/reservations"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              予約一覧
            </a>
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={() => handleCancel()}
              disabled={cancelable}
              className={clsx(
                "block w-full px-3.5 py-2.5",
                "rounded-md shadow-sm",
                "text-center text-sm font-semibold text-white",
                "bg-red-700 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700",
                "disabled:cursor-not-allowed disabled:bg-slate-600"
              )}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReservationsDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationsDetailsContent id={id} />
    </Suspense>
  );
}
