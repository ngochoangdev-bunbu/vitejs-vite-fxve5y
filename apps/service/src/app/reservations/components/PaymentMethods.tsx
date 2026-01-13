import React from "react";
import { mPaymentType } from "@repo/common-utils/master";
import { paymentMethodAtom } from "@/atoms/form-atoms";
import { useAtom } from "jotai";

type Props = {
  readOnly?: boolean;
};

export function PaymentMethods({ readOnly }: Props): React.JSX.Element {
  const [paymentMethod, setPaymentMethod] = useAtom(paymentMethodAtom);

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        お支払い方法
        <span className="text-red-700">*</span>
      </h2>
      <div className="mt-6 space-y-6">
        {mPaymentType.map((item) => (
          <div key={item.id} className="flex items-center gap-x-3">
            <input
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              type="radio"
              value={item.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked={paymentMethod === String(item.id)}
              required
              disabled={readOnly}
            />
            <div className="text-sm leading-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                {item.name}
                {item.description && (
                  <p className="text-gray-500">{item.description}</p>
                )}
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-10">
        <div className="mt-6 space-y-6 relative" hidden={false}>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            当日払いの場合はこちらで先払いをお願いいたします。
          </legend>
          <div className="w-full flex justify-center items-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d831.1828711900226!2d133.53676336967612!3d33.560352198334165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f20!4m13!3e6!4m5!1s0x354e1900306e455b%3A0x2f20bfcdadbf0f4e!2z6auY55-l55yM6auY55-l5biC5biv5bGL55S677yR5LiB55uu77yR77yU4oiS77yZIOOCquODk-ODpOOCruODq-ODiQ!3m2!1d33.560599599999996!2d133.5383688!4m5!1s0x354e193a033e375b%3A0x139dd2e6d7b2656!2z5pyJ6ZmQ5Lya56S-IOS6jOeVquihl-OAgeOAkjc4MC0wODQxIOmrmOefpeecjOmrmOefpeW4guW4r-Wxi-eUuu-8kuS4geebru-8kuKIku-8ke-8lw!3m2!1d33.560235299999995!2d133.5364088!5e0!3m2!1sja!2sjp!4v1723107979373!5m2!1sja!2sjp"
              width="600"
              height="450"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
