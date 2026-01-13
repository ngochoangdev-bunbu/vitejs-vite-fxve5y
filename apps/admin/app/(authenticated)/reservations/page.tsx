"use client";

import { ReservationRecord } from "@repo/common-utils/interfaces";
import { ChangeEvent, ReactNode, useEffect, useState, useCallback, useMemo } from "react";
import BorderedTable, { Column, DataSource } from "../../components/table/BorderedTable";
import dayjs from "dayjs";
import { getReservations } from "../../helpers/reservation";

const TABLE_COLUMNS: Column[] = [
  {
    title: "ステータス",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "貸出場所",
    dataIndex: "roomTypeName",
    key: "roomTypeName",
  },
  {
    title: "受付日時",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "開始日時",
    dataIndex: "checkIn",
    key: "checkIn",
  },
  {
    title: "終了日時",
    dataIndex: "checkOut",
    key: "checkOut",
  },
  {
    title: "法人名",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "担当者",
    dataIndex: "contactName",
    key: "contactName",
  },
];

export default function Reservations() {
  const [tableData, setTableData] = useState<DataSource[]>([]);
  const [recordRoomType, setRecordRoomType] = useState<number>(0); // 0: 全部、1: コワーキングスペース、2: 貸し会議室、3: 貸しホール
  const [recordStatus, setRecordStatus] = useState<number>(1); // 0: 全部、1: 予約、2: キャンセル、3: 終了

  const data = useMemo<ReservationRecord[]>(() => [], []);

  const updateData = useCallback(
    (records: ReservationRecord[]) => {
      const tempRecords = records.slice();
      data.splice(0, data.length);
      data.push(...tempRecords);

      const currentDate = dayjs();
      const filteredData: DataSource[] = [];
      for (const record of data) {
        // DBの日付データを基にstatusを作成
        let statusModifier: number;
        let status: ReactNode;

        if (record.canceledDate) {
          statusModifier = 2;
          status = <p className="text-red-600">キャンセル</p>;
        } else if (dayjs(record.checkIn).isAfter(currentDate)) {
          statusModifier = 1;
          status = <p className="text-black-600">予約</p>;
        } else if (dayjs(record.checkOut).isBefore(currentDate)) {
          statusModifier = 3;
          status = <p className="text-gray-500">終了</p>;
        } else {
          statusModifier = 0;
          status = "";
        }

        const newTableData: DataSource = {
          key: record.id,
          statusModifier,
          status, // TODO: CSS
          roomTypeId: record.mRoomTypeId,
          roomTypeName: (
            <a className="text-blue-600" href={`/reservations/${record.id}`}>
              {record.mRoomTypeName}
            </a>
          ),
          createdAt: record.createdAt,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          companyName: record.companyName,
          contactName: record.contactName,
        };

        filteredData.push(newTableData);
      }
      setTableData(filteredData);
      console.log("Filtered data:", filteredData);
    },
    [data]
  );

  const fetchReservations = useCallback(async () => {
    try {
      const records = await getReservations();
      console.log("DynamoDB records:", records);

      updateData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [updateData]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecordRoomType(Number(event.target.value));
  };

  const handleRecordStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecordStatus(Number(event.target.value));
  };

  const tableDataFilter = (data: DataSource[], type: number = 0, status: number = 0): DataSource[] => {
    const temp: DataSource[] = [];
    const result: DataSource[] = [];

    if (type === 0) {
      temp.push(...data);
    } else {
      const filtered = data.filter((item) => item.roomTypeId === type);
      temp.push(...filtered);
    }

    if (status === 0) {
      result.push(...temp);
    } else {
      const filtered = temp.filter((item) => item.statusModifier === status);
      result.push(...filtered);
    }

    return result;
  };

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">予約一覧</h2>
      <div className="mb-3">
        <div>
          <p>貸出場所</p>
          <select
            value={recordRoomType}
            onChange={handleRoomTypeChange}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value={0}>全部</option>
            <option value={1}>コワーキングスペース</option>
            <option value={2}>貸し会議室</option>
            <option value={3}>貸しホール</option>
          </select>
        </div>
        <div>
          <p>絞り込み</p>
          <select
            value={recordStatus}
            onChange={handleRecordStatusChange}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value={1}>予約</option>
            <option value={2}>キャンセル</option>
            <option value={3}>終了</option>
            <option value={0}>全部</option>
          </select>
        </div>
      </div>
      <BorderedTable columns={TABLE_COLUMNS} dataSource={tableDataFilter(tableData, recordRoomType, recordStatus)} />
    </>
  );
}
