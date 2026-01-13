export interface SurveyRecord {
  estimateId: string;
  mSurveyId: number;
  other: string | null;
  owner: string | null;
}

export interface SurveyRecordWithoutEstimateId {
  mSurveyId: number;
  other?: string;
  owner?: string;
}
