import { User } from "./User";
import { FormReservation } from "./form-reservation";

export interface FormConfirmProps {
  roomTypeId: number;
  totalFee: number;
  user: User;
  estimateName: string;
  payment: string;
  message: string;
  reservations: FormReservation[];
  surveys: string[];
  surveyOther: string;
  surveyOtherInput: string;
}
