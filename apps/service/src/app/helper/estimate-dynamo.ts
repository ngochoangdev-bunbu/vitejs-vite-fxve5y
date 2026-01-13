/**
 * estimatesテーブル,surveysテーブル,reservationsテーブル,optionsテーブルにレコードを追加する
 *
 * @param estimatesId - 見積書のId
 * @param reservations[] - 予約のまとまり
 * @param surveys[] - アンケート
 */

import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { EstimateRecordWithoutId } from "@/interfaces/estimate-record";
import { MeetingFormValues } from "@/interfaces/form-meeting-reservation";
import { HallFormValues } from "@/interfaces/form-hall-reservation";

/**
 * フォームデータをEstimateテーブルに追加するデータ形式に整形する
 *
 * @param formData- フォームデータ
 * @returns フォーマット済みデータ
 */
const formatFormData = (formData: any): EstimateRecordWithoutId => {
  const estimate: EstimateRecordWithoutId = {
    ...(formData.user.id && {
      userId: formData.user.id,
    }),
    ...(formData.user.name && {
      name: formData.user.name,
    }),
    ...(formData.user.companyName && {
      companyName: formData.user.companyName,
    }),
    ...(formData.user.estimateName && {
      estimateName: formData.user.estimateName,
    }),
    ...(formData.user.tel && {
      tel: formData.user.tel,
    }),
    ...(formData.user.email && {
      email: formData.user.email,
    }),
    ...(formData.payment && {
      paymentMethod: formData.payment,
    }),
    ...(formData.message && {
      message: formData.message,
    }),
  };
  return estimate;
};
const formatFormDataOfMeeting = (formData: MeetingFormValues): EstimateRecordWithoutId => {
  const estimate: EstimateRecordWithoutId = {
    ...(formData.user.id && {
      userId: formData.user.id,
    }),
    ...(formData.user.name && {
      name: formData.user.name,
    }),
    ...(formData.user.companyName && {
      companyName: formData.user.companyName,
    }),
    ...(formData.user.estimateName && {
      estimateName: formData.user.estimateName,
    }),
    ...(formData.user.tel && {
      tel: formData.user.tel,
    }),
    ...(formData.user.email && {
      email: formData.user.email,
    }),
    ...(formData.paymentType && {
      paymentMethod: formData.paymentType,
    }),
    ...(formData.note && {
      message: formData.note,
    }),
  };
  return estimate;
};
const formatFormDataOfHall = (formData: HallFormValues): EstimateRecordWithoutId => {
  const estimate: EstimateRecordWithoutId = {
    ...(formData.user.id && {
      userId: formData.user.id,
    }),
    ...(formData.user.name && {
      name: formData.user.name,
    }),
    ...(formData.user.companyName && {
      companyName: formData.user.companyName,
    }),
    ...(formData.user.estimateName && {
      estimateName: formData.user.estimateName,
    }),
    ...(formData.user.tel && {
      tel: formData.user.tel,
    }),
    ...(formData.user.email && {
      email: formData.user.email,
    }),
    ...(formData.paymentType && {
      paymentMethod: formData.paymentType,
    }),
    ...(formData.note && {
      message: formData.note,
    }),
  };
  return estimate;
};

/**
 * Estimateテーブルにレコードを追加する
 *
 * @param formData- フォームデータ
 * @returns 追加したEstimateレコードのid
 */
export const create = async (formData: any) => {
  const estimate = formatFormData(formData);
  //Estimateテーブルにレコードの追加
  const { errors, data: createdEstimate } =
    await cookieBasedClient.models.Estimate.create(
      {
        user_id: estimate.userId,
        name: estimate.name,
        company_name: estimate.companyName,
        estimate_name: estimate.estimateName,
        tel: estimate.tel,
        email: estimate.email,
        payment_method: estimate.paymentMethod,
        message: estimate.message,
        owner: estimate.userId,
      },
      {
        authMode: "identityPool",
      },
    );
  if (!createdEstimate) {
    throw new Error("Failed to create Estimate:" + errors);
  }
  return createdEstimate.id;
};

export const createMeeting = async (formData: MeetingFormValues) => {
  const estimate = formatFormDataOfMeeting(formData);
  //Estimateテーブルにレコードの追加
  const { errors, data: createdEstimate } =
    await cookieBasedClient.models.Estimate.create(
      {
        user_id: estimate.userId,
        name: estimate.name,
        company_name: estimate.companyName,
        estimate_name: estimate.estimateName,
        tel: estimate.tel,
        email: estimate.email,
        payment_method: estimate.paymentMethod,
        message: estimate.message,
        owner: estimate.userId,
      },
      {
        authMode: "identityPool",
      },
    );
  if (!createdEstimate) {
    throw new Error("Failed to create Estimate:" + errors);
  }
  return createdEstimate.id;
};

export const createHall = async (formData: HallFormValues) => {
  const estimate = formatFormDataOfHall(formData);
  //Estimateテーブルにレコードの追加
  const { errors, data: createdEstimate } =
    await cookieBasedClient.models.Estimate.create(
      {
        user_id: estimate.userId,
        name: estimate.name,
        company_name: estimate.companyName,
        estimate_name: estimate.estimateName,
        tel: estimate.tel,
        email: estimate.email,
        payment_method: estimate.paymentMethod,
        message: estimate.message,
        owner: estimate.userId,
      },
      {
        authMode: "identityPool",
      },
    );
  if (!createdEstimate) {
    throw new Error("Failed to create Estimate:" + errors);
  }
  return createdEstimate.id;
};
