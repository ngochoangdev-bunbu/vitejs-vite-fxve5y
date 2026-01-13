export type FormBookingOption = {
  id: number;
  number: number;
};

export interface FormBooking {
  uid: string; // React用、BEに渡さない
  roomTypeId: number;
  date?: string;
  startTime: string;
  endTime: string;
  startTimeFullDay: string;
  endTimeFullDay: string;
  isFullDay: boolean;
  enterTime?: string;
  numberOfParticipants: number;
  personInCharge?: string;
  personInChargeEmail?: string;
  options?: FormBookingOption[];
}

export interface FormReservation {
  //userId?: string;
  contactName: string; //お名前
  companyName: string; //法人名
  recipientName: string; //見積書・請求書宛て名
  email: string; //連絡先のメールアドレス
  tel: string; //連絡先の電話番号
  paymentMethod: string; //支払い方法
  contactNote: string; //連絡事項
  purposes: string[]; //利用用途
  purposesOtherChecked: boolean;
  purposesOtherText: string;
  survey: string[]; //アンケート:答えの配列のみ
  surveyOtherChecked: boolean;
  surveyOtherText: string;
}
