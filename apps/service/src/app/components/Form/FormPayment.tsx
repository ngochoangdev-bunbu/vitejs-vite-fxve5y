interface FormPaymentProps {
  defaultPayment?: string;
  isConfirm?: boolean;
}

export default function FormPayment(props: FormPaymentProps): JSX.Element {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        お支払い方法
        <span className="text-red-700">*</span>
      </h2>

      <div className="space-y-10">
        <fieldset>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-x-3">
              <input
                required
                id="estimate-payment"
                name="payment"
                type="radio"
                value="estimate"
                className={
                  props.isConfirm
                    ? "h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600"
                    : "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                }
                defaultChecked={props?.defaultPayment === "estimate"}
                disabled={props.isConfirm}
              />
              <label
                htmlFor="estimate-payment"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                請求書払い
              </label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                required
                id="same-day-cash-payment"
                name="payment"
                type="radio"
                value="same-day-cash"
                className={
                  props.isConfirm
                    ? "h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600"
                    : "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                }
                defaultChecked={props?.defaultPayment === "same-day-cash"}
                disabled={props.isConfirm}
              />
              <div className="text-sm leading-6">
                <label
                  htmlFor="same-day-cash-payment"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  当日現金払い
                </label>
                <p className="text-gray-500">
                  オビヤギルド近隣の有人店舗でお支払いいただきます
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                required
                id="same-day-card-payment"
                name="payment"
                type="radio"
                value="same-day-card"
                className={
                  props.isConfirm
                    ? "h-4 w-4 border-gray-300 bg-gray-100 text-indigo-600 focus:ring-indigo-600"
                    : "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                }
                defaultChecked={props?.defaultPayment === "same-day-card"}
                disabled={props.isConfirm}
              />
              <div className="text-sm leading-6">
                <label
                  htmlFor="same-day-card-payment"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  当日クレジットカード払い
                </label>
                <p className="text-gray-500">
                  オビヤギルド近隣の有人店舗でお支払いいただきます
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6 relative" hidden={props.isConfirm}>
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              当日払いの場合はこちらで先払いをお願いいたします。
            </legend>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d831.1828711900226!2d133.53676336967612!3d33.560352198334165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f20!4m13!3e6!4m5!1s0x354e1900306e455b%3A0x2f20bfcdadbf0f4e!2z6auY55-l55yM6auY55-l5biC5biv5bGL55S677yR5LiB55uu77yR77yU4oiS77yZIOOCquODk-ODpOOCruODq-ODiQ!3m2!1d33.560599599999996!2d133.5383688!4m5!1s0x354e193a033e375b%3A0x139dd2e6d7b2656!2z5pyJ6ZmQ5Lya56S-IOS6jOeVquihl-OAgeOAkjc4MC0wODQxIOmrmOefpeecjOmrmOefpeW4guW4r-Wxi-eUuu-8kuS4geebru-8kuKIku-8ke-8lw!3m2!1d33.560235299999995!2d133.5364088!5e0!3m2!1sja!2sjp!4v1723107979373!5m2!1sja!2sjp"
              width="600"
              height="450"
              loading="lazy"
            ></iframe>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
