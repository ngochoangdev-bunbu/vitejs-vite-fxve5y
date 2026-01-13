import React from "react";
import { mSurvey, mUsagePurpose } from "@repo/common-utils/master";
import {
  contactNoteAtom,
  purposesAtom,
  purposesOtherCheckedAtom,
  purposesOtherTextAtom,
  surveyAtom,
  surveyOtherCheckedAtom,
  surveyOtherTextAtom,
} from "@/atoms/form-atoms";
import { useAtom } from "jotai";
import { BasicInput } from "./BasicInput";

type Props = {
  readOnly?: boolean;
};

export function Misc({ readOnly }: Props): React.JSX.Element {
  const [contactNote, setContactNote] = useAtom(contactNoteAtom);
  const [usagePurposes, setUsagePurposes] = useAtom(purposesAtom);
  const [usagePurposesOtherChecked, setUsagePurposesOtherChecked] = useAtom(purposesOtherCheckedAtom);
  const [usagePurposesOtherText, setUsagePurposesOtherText] = useAtom(purposesOtherTextAtom);
  const [survey, setSurvey] = useAtom(surveyAtom);
  const [surveyOtherChecked, setSurveyOtherChecked] = useAtom(surveyOtherCheckedAtom);
  const [surveyOtherText, setSurveyOtherText] = useAtom(surveyOtherTextAtom);

  return (
    <div className="border-b border-gray-900/10 pb-12">
      {/* 連絡事項 */}
      <div className="col-span-full">
        <label className="block text-sm leading-6 font-medium text-gray-900">連絡事項</label>
        <div className="mt-2">
          <textarea
            rows={6}
            className="block w-full resize-none rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
            value={contactNote}
            onChange={(e) => setContactNote(e.target.value)}
            disabled={readOnly}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600">連絡事項などあればご記入ください</p>
      </div>
      {/* 利用用途 (任意) */}
      <div className="col-span-full mt-10">
        <legend className="text-sm leading-6 font-semibold text-gray-900">ご利用用途 (任意)</legend>

        <div className="mt-6 space-y-6">
          {/* 利用用途マスタ項目 */}
          {mUsagePurpose.map((item) => (
            <div key={item.id} className="mt-2">
              <div className="relative flex items-center gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    value={item.id}
                    className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={usagePurposes.includes(String(item.id))}
                    onChange={(e) => {
                      setUsagePurposes((prev) => {
                        const prevValues = prev.slice();
                        if (e.target.checked) {
                          return Array.from(new Set([...prevValues, e.target.value]));
                        }
                        return prevValues.filter((v) => v !== e.target.value);
                      });
                    }}
                    disabled={readOnly}
                  />
                </div>
                <div className="text-sm leading-6">
                  <label className="font-medium text-gray-900">{item.name}</label>
                </div>
              </div>
            </div>
          ))}
          {/* 利用用途その他 */}
          <div className="mt-2">
            <div className="relative flex items-center gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={usagePurposesOtherChecked}
                  onChange={(e) => setUsagePurposesOtherChecked(e.target.checked)}
                  disabled={readOnly}
                />
              </div>
              <div className="flex items-center text-sm leading-6">
                <label className="font-medium text-gray-900">その他：</label>
                <BasicInput
                  type="text"
                  value={usagePurposesOtherText}
                  onChange={(e) => setUsagePurposesOtherText(e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* アンケート */}
      <div className="col-span-full mt-10">
        <legend className="text-sm leading-6 font-semibold text-gray-900">アンケート (任意)</legend>

        <div className="mt-6 space-y-6">
          {/* アンケートマスタ項目 */}
          {mSurvey.map((item) => (
            <div key={item.id} className="mt-2">
              <div className="relative flex items-center gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    value={item.id}
                    className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={survey.includes(String(item.id))}
                    onChange={(e) => {
                      setSurvey((prev) => {
                        const prevValues = prev.slice();
                        if (e.target.checked) {
                          return Array.from(new Set([...prevValues, e.target.value]));
                        }
                        return prevValues.filter((v) => v !== e.target.value);
                      });
                    }}
                    disabled={readOnly}
                  />
                </div>
                <div className="text-sm leading-6">
                  <label className="font-medium text-gray-900">{item.name}</label>
                </div>
              </div>
            </div>
          ))}
          {/* アンケートその他 */}
          <div className="mt-2">
            <div className="relative flex items-center gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={surveyOtherChecked}
                  onChange={(e) => setSurveyOtherChecked(e.target.checked)}
                  disabled={readOnly}
                />
              </div>
              <div className="flex items-center text-sm leading-6">
                <label className="font-medium text-gray-900">その他：</label>
                <BasicInput
                  type="text"
                  value={surveyOtherText}
                  onChange={(e) => setSurveyOtherText(e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
