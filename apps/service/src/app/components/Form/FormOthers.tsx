interface FormOthersProps {
  surveys: string[];
  defaultSurvey?: number[];
  defaultSurveyOther?: string;
  defaultSurveyOtherInput?: string;
  defaultMessage?: string;
  readonly?: boolean;
}

export default function FormOthers(props: FormOthersProps): JSX.Element {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="col-span-full">
        <label
          htmlFor="message"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          連絡事項
        </label>
        <div className="mt-2">
          <textarea
            id="message"
            name="message"
            rows={6}
            className={
              props.readonly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
            }
            defaultValue={props.defaultMessage}
            disabled={props.readonly}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          連絡事項などあればご記入ください
        </p>
      </div>

      <div className="mt-10 col-span-full">
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          アンケート(任意)
        </legend>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          オビヤギルドをどこで知りましたか？
        </p>

        <div className="mt-6 space-y-6">
          {props.surveys.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="relative flex items-center gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id={`survey-${index}`}
                    name={`survey-${index}`}
                    type="checkbox"
                    className={
                      props.readonly
                        ? "h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600"
                        : "h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    }
                    defaultChecked={props.defaultSurvey?.includes(index + 1)}
                    disabled={props.readonly}
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor={`survey-${index}`}
                    className="font-medium text-gray-900"
                  >
                    {item}
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-2">
            <div className="relative flex items-center gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="survey-other"
                  name="survey-other"
                  type="checkbox"
                  className={
                    props.readonly
                      ? "h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600"
                      : "h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  }
                  defaultChecked={props.defaultSurveyOther !== ""}
                  disabled={props.readonly}
                />
              </div>
              <div className="flex items-center text-sm leading-6">
                <label
                  htmlFor="survey-other"
                  className="font-medium text-gray-900"
                >
                  その他：
                </label>
                <input
                  type="text"
                  name="survey-other-input"
                  id="survey-other-input"
                  defaultValue={props.defaultSurveyOtherInput}
                  disabled={props.readonly}
                  className={
                    props.readonly
                      ? "block rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      : "block rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
