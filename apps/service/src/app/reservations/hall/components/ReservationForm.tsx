"use client";

import React from "react";
import { Column, DataSource } from "@/app/components/BorderedTable";
import { FormHeader } from "@/app/components/Form";
import TableDataCurrency from "@/app/components/TableDataCurrency";
import clsx from "clsx";
import { Calendar } from "@/app/reservations/components/Calendar";
import { Bookings } from "./Bookings";
import { useAtom } from "jotai";
import { formValidityAtom } from "@/atoms/form-atoms";
import { Contacts } from "@/app/reservations/components/Contacts";
import { PaymentMethods } from "@/app/reservations/components/PaymentMethods";
import { Misc } from "@/app/reservations/components/Misc";
import { useRouter } from "next/navigation";
import { FormLayout } from "./FormLayout";
import { mTimeBasedFee } from "@repo/common-utils/master";

const TABLE_COLUMNS: Column[] = [
  {
    title: "時間帯",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "9:00〜12:00",
    dataIndex: "price1",
    key: "price1",
  },
  {
    title: "12:00〜13:00",
    dataIndex: "price2",
    key: "price2",
  },
  {
    title: "13:00〜17:00",
    dataIndex: "price3",
    key: "price3",
  },
  {
    title: "17:00〜18:00",
    dataIndex: "price4",
    key: "price4",
  },
  {
    title: "夜間18:00〜21:00",
    dataIndex: "price5",
    key: "price5",
  },
  {
    title: "延長 21:00〜22:00",
    dataIndex: "price6",
    key: "price6",
  },
  {
    title: "割安な1日プラン(9:00〜21:00)",
    dataIndex: "price7",
    key: "price7",
  },
];

const TABLE_DATA_SOURCE: DataSource[] = [
  {
    key: "1",
    type: "平日",
    price1: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "09:00" &&
              item.jst_check_out_time === "12:00",
          )?.fee ?? 0
        }
      />
    ),
    price2: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "12:00" &&
              item.jst_check_out_time === "13:00",
          )?.fee ?? 0
        }
      />
    ),
    price3: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "13:00" &&
              item.jst_check_out_time === "17:00",
          )?.fee ?? 0
        }
      />
    ),
    price4: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "17:00" &&
              item.jst_check_out_time === "18:00",
          )?.fee ?? 0
        }
      />
    ),
    price5: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "18:00" &&
              item.jst_check_out_time === "21:00",
          )?.fee ?? 0
        }
      />
    ),
    price6: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "21:00" &&
              item.jst_check_out_time === "22:00",
          )?.fee ?? 0
        }
      />
    ),
    price7: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              item.is_weekday &&
              item.jst_check_in_time === "09:00" &&
              item.jst_check_out_time === "21:00",
          )?.fee ?? 0
        }
      />
    ),
  },
  {
    key: "2",
    type: "土日祝",
    price1: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "09:00" &&
              item.jst_check_out_time === "12:00",
          )?.fee ?? 0
        }
      />
    ),
    price2: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "12:00" &&
              item.jst_check_out_time === "13:00",
          )?.fee ?? 0
        }
      />
    ),
    price3: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "13:00" &&
              item.jst_check_out_time === "17:00",
          )?.fee ?? 0
        }
      />
    ),
    price4: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "17:00" &&
              item.jst_check_out_time === "18:00",
          )?.fee ?? 0
        }
      />
    ),
    price5: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "18:00" &&
              item.jst_check_out_time === "21:00",
          )?.fee ?? 0
        }
      />
    ),
    price6: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "21:00" &&
              item.jst_check_out_time === "22:00",
          )?.fee ?? 0
        }
      />
    ),
    price7: (
      <TableDataCurrency
        num={
          mTimeBasedFee.find(
            (item) =>
              !item.is_weekday &&
              item.jst_check_in_time === "09:00" &&
              item.jst_check_out_time === "21:00",
          )?.fee ?? 0
        }
      />
    ),
  },
];

type Props = {
  user: null;
};

export function ReservationForm({ user }: Props): React.JSX.Element {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [formValidity, setFormValidity] = useAtom(formValidityAtom);

  const handleSubmit = () => {
    if (!formRef.current) return;
    if (formRef.current.reportValidity()) {
      setFormValidity(true);
      router.push("/reservations/hall/confirm");
    }
  };

  return (
    <FormLayout>
      <FormHeader tbColumns={TABLE_COLUMNS} tbDataSource={TABLE_DATA_SOURCE}>
        オビヤギルド3F貸しホール
      </FormHeader>
      <form ref={formRef} className={clsx("mx-auto mt-16 max-w-2xl sm:mt-20")}>
        <div className="space-y-12">
          {/* 連絡先情報 */}
          <Contacts />
          {/* カレンダー */}
          <Calendar roomType="hall" />
          {/* ご希望の日時・コース */}
          <Bookings />
          {/* お支払い方法 */}
          <PaymentMethods />
          {/* 連絡事項・利用用途・アンケート */}
          <Misc />
        </div>
        <div className="mt-10">
          <button
            onClick={handleSubmit}
            type="button"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            次に進む
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
