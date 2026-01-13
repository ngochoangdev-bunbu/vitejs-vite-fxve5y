import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { SurveyRecordWithoutEstimateId } from "@/interfaces/survey-record";
import { MeetingFormValues } from "@/interfaces/form-meeting-reservation";
import { HallFormValues } from "@/interfaces/form-hall-reservation";

/**
 * フォームデータをSurveyテーブルに追加するデータ形式に整形する
 *
 * @param formData- フォームデータ
 * @returns フォーマット済みデータ
 */
const formatFormData = (formData: any) => {
  //アンケートデータ整形
  const surveys: SurveyRecordWithoutEstimateId[] = formData.surveys.map(
    (id: number) => ({
      mSurveyId: id,
    }),
  );
  if (formData.surveyOther) {
    surveys.push({
      mSurveyId: 99,
      other: formData.surveyOtherInput,
    });
  }
  return surveys;
};
const formatFormDataOfMeeting = (formData: MeetingFormValues) => {
  //アンケートデータ整形
  const surveys: SurveyRecordWithoutEstimateId[] = formData.surveys.map(
    (id: number) => ({
      mSurveyId: id,
    }),
  );
  if (formData.surveyOther) {
    surveys.push({
      mSurveyId: 99,
      other: formData.surveyOtherNote,
    });
  }
  return surveys;
};
const formatFormDataOfHall = (formData: HallFormValues) => {
  //アンケートデータ整形
  const surveys: SurveyRecordWithoutEstimateId[] = formData.surveys.map(
    (id: number) => ({
      mSurveyId: id,
    }),
  );
  if (formData.surveyOther) {
    surveys.push({
      mSurveyId: 99,
      other: formData.surveyOtherNote,
    });
  }
  return surveys;
};

/**
 * Surveyテーブルにレコードを追加する
 *
 * @param estimateId- フォームデータ
 * @param formData- フォームデータ
 * @returns 追加したEstimateレコードのid
 */
export const create = async (estimateId: string, formData: any) => {
  const surveys: SurveyRecordWithoutEstimateId[] = formatFormData(formData);
  if (surveys) {
    const surveyPromises = surveys.map((survey) =>
      cookieBasedClient.models.Survey.create(
        {
          estimate_id: estimateId,
          m_survey_id: survey.mSurveyId,
          other: survey.other,
          ...(formData.user.id && {
            owner: formData.user.id,
          }),
        },
        { authMode: "identityPool" },
      ),
    );
    await Promise.all(surveyPromises);
  }
};

export const createMeeting = async (estimateId: string, formData: MeetingFormValues) => {
  const surveys: SurveyRecordWithoutEstimateId[] = formatFormDataOfMeeting(formData);
  if (surveys) {
    const surveyPromises = surveys.map((survey) =>
      cookieBasedClient.models.Survey.create(
        {
          estimate_id: estimateId,
          m_survey_id: survey.mSurveyId,
          other: survey.other,
          ...(formData.user.id && {
            owner: formData.user.id,
          }),
        },
        { authMode: "identityPool" },
      ),
    );
    await Promise.all(surveyPromises);
  }
};

export const createHall = async (estimateId: string, formData: HallFormValues) => {
  const surveys: SurveyRecordWithoutEstimateId[] = formatFormDataOfHall(formData);
  if (surveys) {
    const surveyPromises = surveys.map((survey) =>
      cookieBasedClient.models.Survey.create(
        {
          estimate_id: estimateId,
          m_survey_id: survey.mSurveyId,
          other: survey.other,
          ...(formData.user.id && {
            owner: formData.user.id,
          }),
        },
        { authMode: "identityPool" },
      ),
    );
    await Promise.all(surveyPromises);
  }
};
