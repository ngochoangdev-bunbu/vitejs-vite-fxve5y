import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { EstimateRecord, MisocaEstimateItem } from "@repo/common-utils/interfaces";
import * as misoca from "../lib/misoca";

interface CreateEstimateProps {
  id: string;
  userId?: string | null;
  name?: string | null;
  companyName?: string | null;
  email?: string | null;
  items: MisocaEstimateItem[];
}

interface SendEstimateProps {
  id: string;
  estimateId: number;
  mailSubject: string;
  mailBody: string;
  includingSelfToCc: boolean;
}

const client = generateClient<Schema>();

export async function getEstimates(): Promise<EstimateRecord[]> {
  // DynamoDBからデータを取得する
  const estimates = await client.models.Estimate.list();

  // データ整形処理
  const formattedData: EstimateRecord[] = [];
  for (const item of estimates.data) {
    const record: EstimateRecord = {
      id: item.id,
      userId: item.user_id,
      name: item.name,
      companyName: item.company_name,
      estimateName: item.estimate_name,
      tel: item.tel,
      email: item.email,
      mailSentAt: item.mail_sent_at,
      misocaEstimateId: item.misoca_estimate_id,
      paymentMethod: item.payment_method,
      message: item.message,
      owner: item.owner,
    };

    // 登録ユーザーの情報
    if (record.userId) {
      const user = await client.models.User.get({
        id: record.userId,
      });

      if (user.data) {
        record.name = user.data.name;
        record.companyName = user.data.company_name;
        record.tel = user.data.tel;
        record.email = user.data.email;
      }
    }

    formattedData.push(record);
  }
  return formattedData;
}

export async function createEstimate(props: CreateEstimateProps): Promise<number> {
  const { id, userId, name, companyName, email, items } = props;

  // Misoca OAuthトークンをCookieから取得
  const response = await fetch("/api/misoca/token");
  if (!response.ok) {
    throw new Error("Failed to get misoca token from cookies");
  }
  const { token } = await response.json();

  let contactId: number | null = null;
  // 登録ユーザーであれば、取引先IDを取得してみる
  const user = userId ? await client.models.User.get({ id: userId }) : null;
  contactId = user?.data?.misoca_contact_id ?? null;

  // 取引先IDがなければMISOCAに取引先を作成
  if (!contactId) {
    const misocaContactResponse = await fetch("/api/misoca/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        companyName,
        name,
        email,
      }),
    });

    if (!misocaContactResponse.ok) {
      throw new Error("Failed to create misoca contact");
    }

    const data = await misocaContactResponse.json();
    contactId = data.contactId as number;
  }

  // DynamoDB更新処理（必要であれば）
  if (userId && contactId == null) {
    await client.models.User.update({
      id: userId,
      misoca_contact_id: contactId,
    });
  }

  // MISOCA見積書作成処理
  const misocaEstimateResponse = await fetch("/api/misoca/estimate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      items,
      contactId,
    }),
  });

  
  if (!misocaEstimateResponse.ok) {
    throw new Error("Failed to create misoca estimate");
  }
  
  const { estimateId: misocaEstimateId } = await misocaEstimateResponse.json();

  // DynamoDB更新処理
  const update = await client.models.Estimate.update({
    id: id,
    misoca_estimate_id: misocaEstimateId,
  });
  console.log("DynamoDB response:", update);

  return misocaEstimateId;
}

export async function sendEstimate(props: SendEstimateProps): Promise<string> {
  // Misoca OAuthトークンをCookieから取得
  const response = await fetch("/api/misoca/token");
  if (!response.ok) {
    throw new Error("Failed to get misoca token from cookies");
  }
  const { token } = await response.json();

  const sentAt = await misoca.sendEstimate(
    token, // MISOCAのトークン
    props.id, // estimateのid
    props.estimateId, // MISOCAの見積書id
    props.mailSubject, // メールの件名
    props.mailBody, // メールの本文
    props.includingSelfToCc
  );
  return sentAt;
}
