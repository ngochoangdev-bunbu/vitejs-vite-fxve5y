export interface FormOption {
  mOptionsId: string;
  count: number;
  checked: boolean;
}

export interface FormReservation {
  date: string | null | Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  companions: number;
  isModalOpen: boolean;
  contactName: string;
  contactEmail: string;
  entry?: string;
  options?: FormOption[];
}
