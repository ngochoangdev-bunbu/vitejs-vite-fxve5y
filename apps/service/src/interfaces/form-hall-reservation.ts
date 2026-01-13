import { User } from "./User";
import { Dayjs } from "dayjs";
import { FormCheckboxOption } from "@/app/reservations/components";

export interface HallFormValues {
  user: User;
  details: HallDetail[];
  mOptionList: FormCheckboxOption[] | null;
  paymentType: string;
  note: string;
  mSurveyList: FormCheckboxOption[] | null;
  mUsageList: FormCheckboxOption[] | null;
  surveys: number[];
  surveyOther: boolean;
  surveyOtherNote: string;
  usage: number[];
  usageOther: boolean;
  usageOtherNote: string;
  totalFee: number;
}

export interface HallDetail {
  reservationDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  totalGuests: number;
  entry: string;
  contactName: string;
  contactEmail: string;
  options: HallDetailOption[] | null;
  startDateTimeISO: string;
  endDateTimeISO: string;
  entryDateTimeISO: string;
  fee: number;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
}

export interface HallDetailOption {
  value: boolean;
  count: number;
  mOptionsId: number;
  mOptionsLabel: string;
  mOptionsDesc: string;
}
