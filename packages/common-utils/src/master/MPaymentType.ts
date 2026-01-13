export enum PaymentType {
  Invoice = 1,
  Cash,
  CreditCard,
}

export interface MPaymentTypeItem {
  id: number;
  name: string;
  description?: string;
}

export const mPaymentType: MPaymentTypeItem[] = [
  {
    id: PaymentType.Invoice,
    name: "請求書払い",
  },
  {
    id: PaymentType.Cash,
    name: "当日現金払い",
    description: "オビヤギルド近隣の有人店舗でお支払いいただきます",
  },
  {
    id: PaymentType.CreditCard,
    name: "当日クレジットカード払い",
    description: "オビヤギルド近隣の有人店舗でお支払いいただきます",
  },
];
