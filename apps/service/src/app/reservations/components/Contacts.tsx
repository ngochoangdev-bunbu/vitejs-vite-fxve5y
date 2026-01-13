import React from "react";
import { BasicInput } from "./BasicInput";
import { useAtom } from "jotai";
import {
  companyNameAtom,
  contactNameAtom,
  emailAtom,
  recipientNameAtom,
  telAtom,
} from "@/atoms/form-atoms";

type Props = {
  readOnly?: boolean;
};

export function Contacts({ readOnly }: Props): React.JSX.Element {
  const [contactName, setContactName] = useAtom(contactNameAtom);
  const [companyName, setCompanyName] = useAtom(companyNameAtom);
  const [recipientName, setRecipientName] = useAtom(recipientNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [tel, setTel] = useAtom(telAtom);

  return (
    <>
      {/* 連絡先情報 */}
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          連絡先情報
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* お名前 */}
          <div className="sm:col-span-3">
            <BasicInput
              label="お名前"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              disabled={readOnly}
            />
          </div>
          {/* 法人名(任意) */}
          <div className="sm:col-span-3">
            <BasicInput
              label="法人名(任意)"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {/* 見積書・請求書 宛て名(任意) */}
          <div className="sm:col-span-4">
            <BasicInput
              label="見積書・請求書 宛て名(任意)"
              desc="宛て名が法人名と異なる場合にご記入ください。"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {/* メールアドレス */}
          <div className="sm:col-span-4">
            <BasicInput
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={readOnly}
            />
          </div>
          {/* 連絡のつきやすい電話番号 */}
          <div className="sm:col-span-4">
            <BasicInput
              label="連絡のつきやすい電話番号"
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
    </>
  );
}
