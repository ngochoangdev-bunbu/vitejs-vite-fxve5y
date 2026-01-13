import clsx from "clsx";
import React from "react";

type Props = {
  roomType: "hall" | "meeting";
};

function HallView(): React.JSX.Element {
  return (
    <>
      <div
        className={clsx(
          "border border-gray-500 w-3/4 aspect-[1] overflow-hidden",
        )}
      >
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HALL}&ctz=Asia/Tokyo`}
          className="border-0 w-full h-full"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}

function MeetingRoomView(): React.JSX.Element {
  return (
    <>
      <div
        className={clsx(
          "border border-gray-500 w-1/2 aspect-[1] overflow-hidden",
        )}
      >
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_SM}&ctz=Asia/Tokyo`}
          className="border-0 w-full h-full"
          allowFullScreen
        />
      </div>
      <div
        className={clsx(
          "border border-gray-500 w-1/2 aspect-[1] overflow-hidden",
        )}
      >
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_MD}&ctz=Asia/Tokyo`}
          className="border-0 w-full h-full"
          allowFullScreen
        />
      </div>
    </>
  );
}

export function Calendar({ roomType }: Props): React.JSX.Element {
  return (
    <div className={clsx("w-full flex justify-center items-center gap-2")}>
      {roomType === "hall" && <HallView />}
      {roomType === "meeting" && <MeetingRoomView />}
    </div>
  );
}
