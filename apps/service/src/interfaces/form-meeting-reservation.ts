import { User } from "@/interfaces/User";
import { Dayjs } from "dayjs";
import { FormCheckboxOption } from "@/app/reservations/components";

export interface MeetingFormValues {
  user: User;
  details: MeetingDetail[];
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
  roomType: string;
}

export interface MeetingDetail {
  reservationDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  totalGuests: number;
  contactName: string;
  contactEmail: string;
  startDateTimeISO: string;
  endDateTimeISO: string;
  fee: number;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
  roomTypeId: number;
}
