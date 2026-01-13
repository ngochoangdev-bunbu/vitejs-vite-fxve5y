import { User } from "@/interfaces/User";
import FormInput from "./FormInput";

interface FormContactProps {
  user: User | null;
  readOnly?: boolean;
}

export default function FormContact(props: FormContactProps): JSX.Element {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        連絡先情報
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormInput
            required
            type="text"
            name="name"
            autoComplete="name"
            label="お名前"
            defaultValue={props.user?.name}
            readOnly={props.readOnly}
            inputClassName={
              props.readOnly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                : ""
            }
          />
        </div>

        <div className="sm:col-span-3">
          <FormInput
            type="text"
            name="company-name"
            autoComplete="organization"
            label="法人名(任意)"
            defaultValue={props.user?.companyName}
            readOnly={props.readOnly}
            inputClassName={
              props.readOnly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                : ""
            }
          />
        </div>

        <div className="sm:col-span-4">
          <FormInput
            type="text"
            name="estimate-name"
            label="見積書・請求書 宛て名(任意)"
            desc="宛て名が法人名と異なる場合にご記入ください。"
            defaultValue={props.user?.estimateName}
            readOnly={props.readOnly}
            inputClassName={
              props.readOnly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                : ""
            }
          />
        </div>

        <div className="sm:col-span-4">
          <FormInput
            required
            type="email"
            name="email"
            autoComplete="email"
            label="メールアドレス"
            defaultValue={props.user?.email}
            readOnly={props.readOnly}
            inputClassName={
              props.readOnly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                : ""
            }
          />
        </div>

        <div className="sm:col-span-4">
          <FormInput
            required
            type="tel"
            name="tel"
            autoComplete="tel"
            label="連絡のつきやすい電話番号"
            defaultValue={props.user?.tel}
            readOnly={props.readOnly}
            inputClassName={
              props.readOnly
                ? "block w-full rounded-md border-0 py-1.5 bg-gray-100 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6"
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
