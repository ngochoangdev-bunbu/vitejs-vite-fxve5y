import React from "react";
import { useAtom } from "jotai";
import { bookingsAtom } from "@/atoms/form-atoms";
import clsx from "clsx";
import { mOptionType } from "@repo/common-utils/master";
import { formatCurrencyWithTax } from "@/app/helper/format-tool";
import { BasicInput } from "./BasicInput";

type Props = {
  uid: string;
  readOnly?: boolean;
};

export function BookingOptions({ uid, readOnly }: Props): React.JSX.Element {
  const [bookings, setBookings] = useAtom(bookingsAtom);
  const booking = bookings.find((item) => item.uid === uid);

  const [trashBagCount, setTrashBagCount] = React.useState<number>(
    booking?.options?.find((item) => item.id === 2)?.number || 1,
  );

  const handleOptionChange = (id: number, checked: boolean) => {
    if (!booking) return;

    const number = id === 2 ? trashBagCount : 1;

    setBookings((prev) => {
      const newBookings = prev.slice();
      const bk = newBookings.find((item) => item.uid === uid);
      if (!bk) return prev;

      bk.options = bk.options?.filter((item) => item.id !== id) || [];
      if (checked) {
        bk.options.push({ id, number });
      }

      return newBookings;
    });
  };

  const handleTrashBagCountChange = (value: string) => {
    setTrashBagCount((prev) => {
      const newValue = Number(value);
      if (isNaN(newValue)) return prev;
      return Math.min(Math.max(newValue, 1), 5);
    });
  };

  React.useEffect(() => {
    if (!booking) return;
    if (!booking.options?.some((item) => item.id === 2)) return;

    setBookings((prev) => {
      const newBookings = prev.slice();
      const bk = newBookings.find((item) => item.uid === uid);
      if (!bk) return prev;

      bk.options = bk.options?.map((item) =>
        item.id === 2 ? { ...item, number: trashBagCount } : item,
      );

      return newBookings;
    });
  }, [booking, readOnly, setBookings, trashBagCount, uid]);

  return (
    <>
      <legend className="text-sm font-medium leading-6 text-gray-900">
        オプション
      </legend>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        ゴミ回収については、「缶・ビン・ペットボトル」と「その他のゴミ」で分別をお願いします。
      </p>
      {/* オプションマスタ項目 */}
      <div className="mt-3 space-y-4">
        {mOptionType.map((option) => (
          <div key={option.id} className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                type="checkbox"
                className={clsx({
                  "h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600":
                    readOnly,
                  "h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:bg-gray-900/5 disabled:border-gray-900/5":
                    !readOnly,
                })}
                checked={booking?.options?.some(
                  (item) => item.id === option.id,
                )}
                onChange={(e) =>
                  handleOptionChange(option.id, e.target.checked)
                }
                disabled={readOnly}
              />
            </div>
            <div className="flex text-sm leading-6">
              <label className="font-medium text-gray-900">
                {option.name}
                <span className="ms-2 font-normal text-gray-500 block">
                  {formatCurrencyWithTax(option.option_fee)}(税込)
                </span>
              </label>
              {/* TODO: マスターデータ調整する */}
              {option.id === 2 && (
                <div className="flex h-6 items-center justify-end">
                  <span className="mr-2 items-center">×</span>
                  <BasicInput
                    type="number"
                    value={
                      booking?.options?.find((item) => item.id === 2)?.number
                    }
                    className="w-16"
                    onChange={(e) => handleTrashBagCountChange(e.target.value)}
                    min={1}
                    max={5}
                    disabled={readOnly}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
