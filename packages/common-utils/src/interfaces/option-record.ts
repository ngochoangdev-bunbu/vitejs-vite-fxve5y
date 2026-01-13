export interface OptionRecord {
  id: string;
  reservationId: string;
  mOptionId: number;
  mOptionName: string; // From: MOption Table
  mOptionFee?: number; // From: MOption Table
  quantity: number;
  owner: string | null;
  createdAt: string;
  updatedAt: string;
}
