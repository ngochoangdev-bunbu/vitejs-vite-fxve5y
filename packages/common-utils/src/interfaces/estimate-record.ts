export interface EstimateRecord {
  id: string;
  userId: string | null;
  name: string | null;
  companyName: string | null;
  estimateName: string | null;
  tel: string | null;
  email: string | null;
  mailSentAt: string | null;
  misocaEstimateId: number | null;
  paymentMethod: string | null;
  message: string | null;
  owner: string | null;
}

export interface EstimateRecordWithoutId {
  userId?: string;
  name?: string;
  companyName?: string;
  estimateName?: string;
  tel?: string;
  email?: string;
  mailSentAt?: string;
  misocaEstimateId?: number;
  paymentMethod?: string;
  message?: string;
  owner?: string;
}
