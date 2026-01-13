export interface ReservationRecord {
  id: string;
  estimatesId: string;
  mRoomTypeId: number;
  mRoomTypeName: string; // From: MRoomType Table
  checkIn: string;
  checkOut: string;
  isAllDay: boolean;
  baseFee: number;
  companions: number;
  companyName: string;
  contactName: string;
  contactEmail: string;
  canceledDate: string;
  googleCalendarEventId: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
