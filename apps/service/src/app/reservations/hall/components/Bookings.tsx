import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { bookingsAtom } from "@/atoms/form-atoms";
import { BookingsItem } from "./BookingsItem";
import { RoomType } from "@repo/common-utils/master";
import { FormBooking } from "@repo/common-utils/interfaces";
import { ulid } from "ulid";

dayjs.extend(utc);
dayjs.extend(timezone);

function generateDefaultBooking(): FormBooking {
  return {
    uid: ulid(),
    roomTypeId: RoomType.Hall,
    startTime: "",
    endTime: "",
    startTimeFullDay: "",
    endTimeFullDay: "",
    isFullDay: false,
    enterTime: "",
    numberOfParticipants: 1,
  };
}

type Props = {
  readOnly?: boolean;
};

export function Bookings({ readOnly }: Props): React.JSX.Element {
  const [bookings, setBookings] = useAtom(bookingsAtom);

  React.useEffect(() => {
    if (bookings.length === 0) {
      setBookings([generateDefaultBooking()]);
    }
  }, [bookings.length, setBookings]);

  const handleAdd = () => {
    setBookings((prev) => {
      const newBookings = prev.slice();
      return [...newBookings, generateDefaultBooking()];
    });
  };

  const handleDuplicate = (uid: string) => {
    const target = bookings.find((item) => item.uid === uid);
    if (!target) return;

    setBookings((prev) => {
      const newBooking = Object.assign({}, target, { uid: ulid() });
      return [...prev, newBooking];
    });
  };

  const handleDelete = (uid: string) => {
    const target = bookings.find((item) => item.uid === uid);
    if (!target) return;

    setBookings((prev) => {
      const newBookings = prev.slice().filter((item) => item.uid !== uid);
      return newBookings;
    });
  };

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        ご希望の日時・コース
      </h2>
      {bookings.map((booking) => (
        <BookingsItem
          key={booking.uid}
          uid={booking.uid}
          onDuplicate={() => handleDuplicate(booking.uid)}
          onDelete={() => handleDelete(booking.uid)}
          readOnly={readOnly}
        />
      ))}
      {/* ご希望日を追加 */}
      {!readOnly && (
        <div className="flex justify-center col-span-12">
          <button
            type="button"
            onClick={() => handleAdd()}
            className="pt-10 text-sm font-semibold leading-6 text-green-900 flex items-center"
          >
            <PlusIcon className="w-5 h-5 text-green-900 mr-2" />
            ご希望日を追加
          </button>
        </div>
      )}
    </div>
  );
}
