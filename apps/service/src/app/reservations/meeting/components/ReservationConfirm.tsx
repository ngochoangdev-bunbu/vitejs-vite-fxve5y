"use client";

import React from "react";
import { useAtomValue } from "jotai";
import {
  contactNameAtom,
  companyNameAtom,
  recipientNameAtom,
  emailAtom,
  telAtom,
  contactNoteAtom,
  paymentMethodAtom,
  purposesAtom,
  purposesOtherCheckedAtom,
  purposesOtherTextAtom,
  surveyAtom,
  surveyOtherCheckedAtom,
  surveyOtherTextAtom,
  bookingsAtom,
  formValidityAtom,
} from "@/atoms/form-atoms";
import { Contacts } from "@/app/reservations/components/Contacts";
import { Bookings } from "./Bookings";
import { PaymentMethods } from "@/app/reservations/components/PaymentMethods";
import { Misc } from "@/app/reservations/components/Misc";
import ReCaptchaComponent from "@/app/components/recaptcha";
import Spinner from "@/app/components/Spinner";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/app/helper/format-tool";
import clsx from "clsx";
import { FormReservation } from "@repo/common-utils/interfaces";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/app/components/Modal";
import { FormLayout } from "./FormLayout";
import { createReservationMeeting } from "@/app/helper/reservation";

export function ReservationConfirm(): React.JSX.Element {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const formValidity = useAtomValue(formValidityAtom);

  const contactName = useAtomValue(contactNameAtom);
  const companyName = useAtomValue(companyNameAtom);
  const recipientName = useAtomValue(recipientNameAtom);
  const email = useAtomValue(emailAtom);
  const tel = useAtomValue(telAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);
  const contactNote = useAtomValue(contactNoteAtom);
  const purposes = useAtomValue(purposesAtom);
  const purposesOtherChecked = useAtomValue(purposesOtherCheckedAtom);
  const purposesOtherText = useAtomValue(purposesOtherTextAtom);
  const survey = useAtomValue(surveyAtom);
  const surveyOtherChecked = useAtomValue(surveyOtherCheckedAtom);
  const surveyOtherText = useAtomValue(surveyOtherTextAtom);

  const bookings = useAtomValue(bookingsAtom);

  const [reCaptchaToken, setReCaptchaToken] = React.useState<string | null>(null);
  const [totalFee, setTotalFee] = React.useState<number>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [modalTitle, setModalTitle] = React.useState<string | React.ReactNode>("");
  const [modalContent, setModalContent] = React.useState<React.ReactNode>(<></>);

  React.useEffect(() => {
    if (!formValidity) {
      router.push("/reservations/meeting");
    }
  }, [router, formValidity]);

  // 合計金額計算
  React.useEffect(() => {
    const calcTotalFee = async () => {
      try {
        const response = await fetch("/api/total-fee-calculation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookings }),
        });

        if (response.ok) {
          const { totalFee } = await response.json();
          setTotalFee(totalFee);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message ?? "unknown error");
        }
      } catch (error) {
        console.error(error);
      }
    };

    void calcTotalFee();
  }, [bookings, setTotalFee]);

  const handleSubmit = async () => {
    if (!formRef.current) return;
    if (!reCaptchaToken) return;
    if (!formRef.current.reportValidity()) return;
    if (!totalFee) return;

    try {
      setIsLoading(true);

      const reservation: FormReservation = {
        contactName,
        companyName,
        recipientName,
        email,
        tel,
        contactNote,
        paymentMethod,
        purposes,
        purposesOtherChecked,
        purposesOtherText,
        survey,
        surveyOtherChecked,
        surveyOtherText,
      };

      await createReservationMeeting(reservation, bookings, totalFee, reCaptchaToken);
      router.push("/reservations/meeting/overview");
    } catch (error: any) {
      console.error(error);
      setModalTitle(
        <div className="flex items-center text-red-800">
          <XCircleIcon className="mr-2 h-10 w-10" />
          <h3 className="whitespace-nowrap">予約に失敗しました</h3>
        </div>
      );
      setModalContent(<div>{error.message}</div>);
      setIsModalOpen(true);
    } finally {
      //setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleModalSubmit = () => {
    setIsModalOpen(false);
  };

  return (
    <FormLayout>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          オビヤギルド3F貸し会議室
          <br />
          お申し込み内容確認
        </h2>
        <p className="mt-2 text-xl font-bold text-red-500">まだお申し込みは完了していません。</p>
      </div>

      <form ref={formRef} className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <div className="space-y-12">
          {/* 連絡先情報 */}
          <Contacts readOnly />
          {/* ご希望の日時・コース */}
          <Bookings readOnly />
          {/* お支払い方法 */}
          <PaymentMethods readOnly />
          {/* 連絡事項・利用用途・アンケート */}
          <Misc readOnly />
          {/* 合計金額： */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <div className="mt-2">
              <div className="flex items-center justify-start">
                合計金額：
                {totalFee ? <span>{formatCurrency(totalFee)}</span> : <Spinner />}
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-12">
          <div className="mb-2 flex justify-center">
            <div>
              <ReCaptchaComponent onChange={(token) => setReCaptchaToken(token)} />
            </div>
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <div>
                <button
                  onClick={handleBack}
                  type="button"
                  className="rounded-md bg-gray-300 px-6 py-3 text-sm font-semibold text-black shadow-xs hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-hidden"
                >
                  戻る
                </button>
                <button
                  onClick={() => handleSubmit()}
                  type="button"
                  className={clsx(
                    "ml-4 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xs",
                    "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden",
                    "hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-red-900 disabled:hover:bg-red-900"
                  )}
                  disabled={!reCaptchaToken || !totalFee || isLoading}
                >
                  {isLoading ? "送信中..." : "送信"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <Modal title={modalTitle} submitTitle="閉じる" onSubmit={() => handleModalSubmit()}>
          {modalContent}
        </Modal>
      )}
    </FormLayout>
  );
}
