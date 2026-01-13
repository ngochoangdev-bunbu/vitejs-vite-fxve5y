"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { bookingsAtom, formValidityAtom } from "@/atoms/form-atoms";
import { useAtomValue } from "jotai";

const backPath = "/";

export default function Page(): React.JSX.Element {
  const router = useRouter();

  const formValidity = useAtomValue(formValidityAtom);

  const bookings = useAtomValue(bookingsAtom);

  React.useEffect(() => {
    // フォームの値が空の場合はホームページへリダイレクト
    if (!formValidity) {
      router.push(backPath);
    }
  }, [formValidity, router]);

  const handleBack = (backPath: string) => {
    router.push(backPath);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-6">予約完了</h1>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={booking.uid}>
              <h3 className="text-lg font-medium">希望日 {index + 1}</h3>
              <p className="text-gray-700">
                {booking.date?.toString().replace(/-/g, "/")}{" "}
                {booking.isFullDay
                  ? `${booking.startTimeFullDay}～${booking.endTimeFullDay}`
                  : `${booking.startTime}～${booking.endTime}`}
              </p>
            </div>
          ))}
        </div>
        {/* ホームに戻る */}
        <button
          type="button"
          onClick={() => handleBack(backPath)}
          className="mt-6 w-full block text-center py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
