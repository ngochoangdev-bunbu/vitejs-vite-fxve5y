"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import BorderedTable, { Column, DataSource } from "../../components/table/BorderedTable";
import Spinner from "../../components/common/Spinner";
import { ReservationRecord, EstimateRecord, OptionRecord } from "@repo/common-utils/interfaces";
import { getReservations } from "../../helpers/reservation";
import { getOptions } from "../../helpers/options";
import { createEstimate, getEstimates } from "../../helpers/estimate";
import { MisocaEstimateItem } from "@repo/common-utils/interfaces";
import { getMailTemplate } from "../../helpers/mail-template";
// import { useAlert } from "@/contexts/AlertContext";

const TABLE_COLUMNS: Column[] = [
  {
    title: "予約項目",
    dataIndex: "estimateName",
    key: "estimateName",
  },
  {
    title: "法人名",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "名前",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "メール",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "電話番号",
    dataIndex: "tel",
    key: "tel",
  },
  {
    title: "メッセージ",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "支払い方法",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "MISOCA見積書ID",
    dataIndex: "misocaEstimateId",
    key: "misocaEstimateId",
  },
  {
    title: "見積書送信",
    dataIndex: "sendEstimate",
    key: "sendEstimate",
  },
];

export default function Estimates() {
  const [tableData, setTableData] = useState<DataSource[]>([]);
  const [isMailConfirmModalOpen, setIsMailConfirmModalOpen] = useState<boolean>(false);
  const [inputTextTitle, setInputTextTitle] = useState<string>("");
  const [inputTextMessage, setInputTextMessage] = useState<string>("");
  const [companyName, setCompanyName] = useState<string | null>("");
  const [contactName, setContactName] = useState<string | null>("");
  const [contactEmail, setContactEmail] = useState<string | null>("");
  const [includingSelfToCc, setIncludingSelfToCc] = useState<boolean>(true);
  const [selectId, setSelectId] = useState<string | null>("");
  const [selectEstimateId, setSelectEstimateId] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { showAlert } = useAlert();
  const data = useMemo<EstimateRecord[]>(() => [], []);

  // メッセージの文字を置換
  const replaceMassage = useCallback(
    (message: string, name: string, companyName: string | null, estimateName: string | null): string => {
      // 担当者
      const replaceName: string = name!;
      // 法人名
      const replaceCompanyName: string = companyName || "";
      // 見積書・請求書宛て名
      const replaceEstimateName: string = estimateName || companyName || name!;

      const replacedMassage: string = message
        .replace("{{担当者}}", replaceName)
        .replace("{{法人名}}", replaceCompanyName)
        .replace("{{見積書・請求書宛て名}}", replaceEstimateName);

      return replacedMassage;
    },
    []
  );

  // メール送信確認モーダル表示
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showMailConfirmModal = async (id: string) => {
    try {
      const target = data.find((item) => item.id === id);
      if (!target) return;

      // メールテンプレートを取得する
      const mailTemplate = await getMailTemplate(1);
      setSelectId(id);
      setInputTextTitle(mailTemplate.title);
      setSelectEstimateId(target.misocaEstimateId);

      // メッセージの文字を置換する
      const replacedMassage: string = replaceMassage(
        mailTemplate.message,
        target.name ?? "",
        target.companyName,
        target.estimateName
      );
      setInputTextMessage(replacedMassage);

      setContactEmail(target.email);
      setContactName(target.name);
      setCompanyName(target.companyName);
      setIsMailConfirmModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreateMisocaEstimate = async (id: string) => {
    const target = data.find((item) => item.id === id);
    if (!target) return;

    const estimateItems: MisocaEstimateItem[] = [];

    try {
      // DBから予約項目の取得
      const reservationsData: ReservationRecord[] = await getReservations(target.id);

      for (const record of reservationsData) {
        const item: MisocaEstimateItem = {
          name: record.mRoomTypeName,
          quantity: 1, // TODO
          unit_price: record.baseFee,
        };

        estimateItems.push(item);
      }

      // オプションの追加
      for (const record of reservationsData) {
        // DBからオプション情報の取得
        const optionsData: OptionRecord[] = await getOptions(record.id);

        const items: MisocaEstimateItem[] = optionsData.map((option) => ({
          name: option.mOptionName,
          quantity: option.quantity,
          unit_price: option.mOptionFee || 0,
        }));

        estimateItems.push(...items);
      }

      // Misoca見積書の作成
      const estimateId = await createEstimate({
        id: target.id,
        userId: target.userId,
        name: target.name,
        companyName: target.companyName,
        email: target.email,
        items: estimateItems,
      });

      console.log("Estimate ID:", estimateId);

      // フロントのデータの更新
      target.misocaEstimateId = estimateId;
      updateData(data);
    } catch (error) {
      console.error("Error creating estimate:", error);
    }
  };

  const updateData = useCallback(
    (records: EstimateRecord[]) => {
      const tempRecords = records.slice();
      data.splice(0, data.length);
      data.push(...tempRecords);

      const filteredData: DataSource[] = [];
      for (const record of data) {
        const baseBtnClass =
          "rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600";

        const btnClass = record.misocaEstimateId ? `${baseBtnClass} opacity-50 cursor-not-allowed` : baseBtnClass;

        const newTableData: DataSource = {
          key: record.id,
          estimateName: record.estimateName,
          companyName: record.companyName,
          name: record.name,
          email: record.email,
          tel: record.tel,
          message: record.message,
          paymentMethod: record.paymentMethod,
          misocaEstimateId: record.misocaEstimateId ? (
            <a
              target="_blank"
              href={`https://app.misoca.jp/estimates/${record.misocaEstimateId}`}
              className="text-blue-400"
            >
              {record.misocaEstimateId}
            </a>
          ) : (
            <button
              className={btnClass}
              onClick={() => handleCreateMisocaEstimate(record.id)}
              disabled={record.misocaEstimateId ? true : false}
            >
              作成
            </button>
          ),
          sendEstimate: record.mailSentAt ? (
            record.mailSentAt
          ) : record.misocaEstimateId ? (
            <button className={baseBtnClass} onClick={() => showMailConfirmModal(record.id)}>
              見積書送信
            </button>
          ) : null,
        };

        filteredData.push(newTableData);
      }
      setTableData(filteredData);
      console.log("Filtered data:", filteredData);
    },
    [data]
  );

  const fetchEstimates = useCallback(async () => {
    try {
      const records = await getEstimates();
      console.log("DynamoDB records:", records);
      updateData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [updateData]);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleCheckboxChange = () => {
    setIncludingSelfToCc(!includingSelfToCc);
  };

  const closeMailConfirmModal = () => {
    setIsMailConfirmModalOpen(false);
  };

  const handleTextChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputTextTitle(newText);
  };

  const handleTextChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputTextMessage(newText);
  };

  const mailConfirmModalElement = () => {
    return (
      <div className="fixed inset-0 z-1000 flex h-full w-full flex-wrap items-center justify-center overflow-auto p-4 font-[sans-serif] before:fixed before:inset-0 before:h-full before:w-full before:bg-[rgba(0,0,0,0.5)]">
        <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center border-b border-gray-300 pb-3">
            <h3 className="flex-1 text-xl font-bold text-gray-800">メール送信</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 w-3 shrink-0 cursor-pointer fill-gray-400 hover:fill-red-500"
              viewBox="0 0 320.591 320.591"
              onClick={closeMailConfirmModal}
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </div>

          <div className="my-6">
            <p className="text-sm leading-relaxed text-gray-600">宛先</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {companyName || contactName} {contactEmail}
            </p>
            <p className="text-sm leading-relaxed text-gray-600">件名</p>
            <div className="flex items-start">
              <textarea
                id="message"
                name="message"
                rows={1}
                className="block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                value={inputTextTitle}
                onChange={handleTextChangeTitle}
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-600">本文</p>
            <div className="flex items-start">
              <textarea
                id="message"
                name="message"
                rows={5}
                className="block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                value={inputTextMessage}
                onChange={handleTextChangeMessage}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-300 pt-6">
            <div className="inline-flex items-center">
              <label className="relative flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={includingSelfToCc}
                  onChange={handleCheckboxChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-slate-800 checked:bg-slate-800 hover:shadow-md"
                  id="check"
                />
              </label>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">自分宛にもCCを送信</p>
            {isLoading ? (
              <Spinner />
            ) : (
              <button
                type="button"
                className="ml-4 rounded-lg border-none bg-blue-600 px-4 py-2 text-sm tracking-wide text-white outline-none hover:bg-blue-700 active:bg-blue-600"
                onClick={handleSendMisocaEstimate}
              >
                送信
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  //見積メール送信処理
  const handleSendMisocaEstimate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/misoca-send-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectId,
          estimateId: selectEstimateId,
          mailSubject: inputTextTitle,
          mailBody: inputTextMessage,
          inCludingSelfToCc: includingSelfToCc,
        }),
      });
      if (response.status === 200) {
        //送信時刻を更新
        await fetchEstimates();
        // showAlert("success", "メール送信が完了しました");
      } else {
        const errorData = await response.json();
        // showAlert("error", errorData.message);
        throw new Error("Failed to send mail:" + errorData.message);
      }
    } catch (e: any) {
      console.error("Error send estimate:", e);
      // showAlert("error", e.message);
    } finally {
      setIsLoading(false);
      //メール送信確認モーダルを閉じる
      closeMailConfirmModal();
    }
  };

  return (
    <>
      {isMailConfirmModalOpen && mailConfirmModalElement()}
      <h2 className="mb-4 text-2xl font-bold">見積書一覧</h2>
      <BorderedTable columns={TABLE_COLUMNS} dataSource={tableData} />
    </>
  );
}
