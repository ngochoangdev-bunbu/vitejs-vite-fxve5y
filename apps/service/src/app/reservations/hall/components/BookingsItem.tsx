import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SimpleCard } from "@/app/components/Card";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { BasicInput } from "@/app/reservations/components/BasicInput";
import { useAtom, useAtomValue } from "jotai";
import { bookingsAtom } from "@/atoms/form-atoms";
import { BookingOptions } from "@/app/reservations/components/BookingOptions";

dayjs.extend(utc);
dayjs.extend(timezone);

const START_TIME_VALUES: string[] = ["09:00", "12:00", "13:00", "17:00", "18:00"];

const END_TIME_VALUES: string[] = ["12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

type Props = {
  uid: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
  readOnly?: boolean;
};

function CardHeader({ uid, onDelete, onDuplicate, readOnly }: Props): React.JSX.Element {
  const bookings = useAtomValue(bookingsAtom);
  const [index, setIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    const idx = bookings.findIndex((item) => item.uid === uid);
    setIndex(idx);
  }, [bookings, uid]);

  return (
    <ul
      className="flex flex-wrap justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-500"
      id="defaultTab"
      data-tabs-toggle="#defaultTabContent"
      role="tablist"
    >
      <li className="me-2">
        <h3 className="inline-block p-4">ご希望日{index + 1}</h3>
      </li>
      <li className="grow" />
      {!readOnly && (
        <>
          {index > 0 && (
            <li className="me-2">
              <button
                type="button"
                className="flex items-center p-4 text-red-900 hover:text-gray-600"
                onClick={() => onDelete?.()}
              >
                <TrashIcon className="mr-2 h-5 w-5 text-red-900" />
                削除
              </button>
            </li>
          )}
          <li className="me-2">
            <button
              type="button"
              className="flex items-center p-4 text-gray-900 hover:text-gray-600"
              onClick={() => onDuplicate?.()}
            >
              <DocumentDuplicateIcon className="mr-2 h-5 w-5 text-gray-900" />
              複製
            </button>
          </li>
        </>
      )}
    </ul>
  );
}

export function BookingsItem({ uid, onDelete, onDuplicate, readOnly }: Props): React.JSX.Element {
  const [bookings, setBookings] = useAtom(bookingsAtom);
  const booking = bookings.find((item) => item.uid === uid);

  // startTimeとendTimeが未設定の場合、初期値を設定する
  React.useEffect(() => {
    const booking = bookings.find((item) => item.uid === uid);
    if (!booking) return;

    if (!booking.startTime) {
      setBookings((prev) => {
        const newBookings = prev.slice();
        const bk = newBookings.find((item) => item.uid === uid);
        if (bk) {
          bk.startTime = START_TIME_VALUES[0];
        }
        return newBookings;
      });
    }
    if (!booking.endTime) {
      setBookings((prev) => {
        const newBookings = prev.slice();
        const bk = newBookings.find((item) => item.uid === uid);
        if (bk) {
          bk.endTime = END_TIME_VALUES[0];
        }
        return newBookings;
      });
    }
    if (!booking.startTimeFullDay) {
      setBookings((prev) => {
        const newBookings = prev.slice();
        const bk = newBookings.find((item) => item.uid === uid);
        if (bk) {
          bk.startTimeFullDay = START_TIME_VALUES[0];
        }
        return newBookings;
      });
    }
    if (!booking.endTimeFullDay) {
      setBookings((prev) => {
        const newBookings = prev.slice();
        const bk = newBookings.find((item) => item.uid === uid);
        if (bk) {
          bk.endTimeFullDay = END_TIME_VALUES[END_TIME_VALUES.length - 1];
        }
        return newBookings;
      });
    }
    if (!booking.enterTime) {
      setBookings((prev) => {
        const newBookings = prev.slice();
        const bk = newBookings.find((item) => item.uid === uid);
        if (bk) {
          bk.enterTime = "08:30";
        }
        return newBookings;
      });
    }
  }, [bookings, setBookings, uid]);

  return (
    <SimpleCard header={<CardHeader uid={uid} onDuplicate={onDuplicate} onDelete={onDelete} readOnly={readOnly} />}>
      {/* ご希望日 */}
      <div className="col-span-12 sm:col-span-12 md:col-span-4">
        <BasicInput
          label="ご希望日"
          type="date"
          value={booking?.date ?? ""}
          min={dayjs().format("YYYY-MM-DD")}
          max={dayjs().add(1, "year").format("YYYY-MM-DD")}
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.date = e.target.value;
              }
              return newBookings;
            })
          }
          required
          disabled={readOnly}
        />
      </div>
      {/* 開始時刻 */}
      <div className="col-span-6 sm:col-span-6 md:col-span-3">
        <label className="block text-sm leading-6 font-medium text-gray-900">開始時刻</label>
        <select
          disabled={(readOnly || bookings.find((item) => item.uid === uid)?.isFullDay) ?? false}
          value={booking?.isFullDay ? START_TIME_VALUES[0] : (booking?.startTime ?? START_TIME_VALUES[0])}
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.startTime = e.target.value;
              }
              return newBookings;
            })
          }
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
        >
          {START_TIME_VALUES.map((value) => (
            <option value={value} key={value} className="disabled:text-gray-900/25">
              {value}
            </option>
          ))}
        </select>
      </div>
      {/* 終了時刻 */}
      <div className="col-span-6 sm:col-span-6 md:col-span-3">
        <label className="block text-sm leading-6 font-medium text-gray-900">終了時刻</label>
        <select
          disabled={(readOnly || booking?.isFullDay) ?? false}
          value={
            booking?.isFullDay
              ? END_TIME_VALUES[END_TIME_VALUES.length - 1]
              : (booking?.endTime ?? END_TIME_VALUES[END_TIME_VALUES.length - 1])
          }
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.endTime = e.target.value;
              }
              return newBookings;
            })
          }
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
        >
          {END_TIME_VALUES.map((value) => (
            <option value={value} key={value} className="disabled:text-gray-900/25">
              {value}
            </option>
          ))}
        </select>
      </div>
      {/* 1日コース */}
      <div className="col-span-12 mb-2">
        <div className="relative flex gap-x-3">
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:border-gray-900/5 disabled:bg-gray-900/5"
              checked={booking?.isFullDay ?? false}
              onChange={(e) =>
                setBookings((prev) => {
                  const newBookings = prev.slice();
                  const bk = newBookings.find((item) => item.uid === uid);
                  if (bk) {
                    bk.isFullDay = e.target.checked;
                  }
                  return newBookings;
                })
              }
              disabled={readOnly}
            />
          </div>
          <div className="text-sm leading-6">
            <label className="font-medium text-gray-900">
              1日コース
              <span className="ms-2 font-normal text-gray-500">(09:00〜21:00)</span>
            </label>
          </div>
        </div>
      </div>
      {/* ご利用予定人数 */}
      <div className="col-span-12 sm:col-span-12 md:col-span-4">
        <BasicInput
          label="ご利用予定人数"
          type="number"
          required
          value={booking?.numberOfParticipants ?? 1}
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.numberOfParticipants = Number(e.target.value);
              }
              return newBookings;
            })
          }
          min={1}
          max={100}
          disabled={readOnly}
        />
      </div>
      {/* 担当者入室時刻 */}
      <div className="col-span-6 sm:col-span-6 md:col-span-4">
        <BasicInput
          label="担当者入室時刻"
          type="time"
          required
          value={booking?.enterTime ?? ""}
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.enterTime = e.target.value;
              }
              return newBookings;
            })
          }
          disabled={readOnly}
        />
      </div>
      {/* 当日ご担当者 */}
      <div className="col-span-12 sm:col-span-12 md:col-span-5">
        <BasicInput
          label="当日ご担当者(任意)"
          type="text"
          value={booking?.personInCharge ?? ""}
          onChange={(e) =>
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.personInCharge = e.target.value;
              }
              return newBookings;
            })
          }
          disabled={readOnly}
        />
      </div>
      {/* 当日ご担当者メールアドレス */}
      <div className="col-span-12 sm:col-span-12 md:col-span-5">
        <BasicInput
          label="当日ご担当者メールアドレス(任意)"
          type="email"
          value={booking?.personInChargeEmail ?? ""}
          onChange={(e) => {
            setBookings((prev) => {
              const newBookings = prev.slice();
              const bk = newBookings.find((item) => item.uid === uid);
              if (bk) {
                bk.personInChargeEmail = e.target.value;
              }
              return newBookings;
            });
          }}
          disabled={readOnly}
        />
      </div>
      {/* オプション */}
      <div className="col-span-full mt-6">
        <BookingOptions uid={uid} readOnly={readOnly} />
      </div>
    </SimpleCard>
  );
}
