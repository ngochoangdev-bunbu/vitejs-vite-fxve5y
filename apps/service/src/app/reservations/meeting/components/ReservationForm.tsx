"use client";

import React from "react";
import { Column, DataSource } from "@/app/components/BorderedTable";
import { FormHeader } from "@/app/components/Form";
import TableDataCurrency from "@/app/components/TableDataCurrency";
import { RoomType, mUsageBasedFee } from "@repo/common-utils/master";
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

const TABLE_COLUMNS: Column[] = [
  {
    title: "会議室タイプ",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "平日（1時間）",
    dataIndex: "normalPrice",
    key: "normalPrice",
  },
  {
    title: "土日祝（1時間）",
    dataIndex: "specialPrice",
    key: "specialPrice",
  },
];

const TABLE_DATA_SOURCE: DataSource[] = [
  {
    key: "small",
    type: "小会議室8:00〜22:00",
    normalPrice: (
      <TableDataCurrency
        num={
          mUsageBasedFee.find(
            (item) =>
              item.m_room_type_id === RoomType.MeetingRoomSmall &&
              item.is_weekday === true,
          )?.hourly_fee ?? 0
        }
      />
    ),
    specialPrice: (
      <TableDataCurrency
        num={
          mUsageBasedFee.find(
            (item) =>
              item.m_room_type_id === RoomType.MeetingRoomSmall &&
              item.is_weekday === false,
          )?.hourly_fee ?? 0
        }
      />
    ),
  },
  {
    key: "medium",
    type: "中会議室8:00〜22:00",
    normalPrice: (
      <TableDataCurrency
        num={
          mUsageBasedFee.find(
            (item) =>
              item.m_room_type_id === RoomType.MeetingRoomMedium &&
              item.is_weekday === true,
          )?.hourly_fee ?? 0
        }
      />
    ),
    specialPrice: (
      <TableDataCurrency
        num={
          mUsageBasedFee.find(
            (item) =>
              item.m_room_type_id === RoomType.MeetingRoomMedium &&
              item.is_weekday === false,
          )?.hourly_fee ?? 0
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
      router.push("/reservations/meeting/confirm");
    }
  };

  return (
    <FormLayout>
      <FormHeader tbColumns={TABLE_COLUMNS} tbDataSource={TABLE_DATA_SOURCE}>
        オビヤギルド3F貸し会議室
      </FormHeader>
      <form ref={formRef} className={clsx("mx-auto mt-16 max-w-2xl sm:mt-20")}>
        <div className="space-y-12">
          {/* 連絡先情報 */}
          <Contacts />
          {/* カレンダー */}
          <Calendar roomType="meeting" />
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
