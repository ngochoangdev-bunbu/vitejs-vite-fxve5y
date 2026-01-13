import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { MisocaEstimateItem } from "@repo/common-utils/interfaces";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const API_URL = process.env.NEXT_PUBLIC_MISOCA_API_ENDPOINT;

const client = generateClient<Schema>();

/**
 * MISOCAの取引先を作成する
 *
 * @param token - MISOCAのOAuthトークン
 * @param companyName - 法人名
 * @param name - 名前
 * @param email - メールアドレス
 * @returns MISOCAの取引先ID
 */
export const makeContact = async (
  token: string,
  companyName?: string | null,
  name?: string | null,
  email?: string | null
): Promise<number> => {
  try {
    if (!name) {
      throw new Error("No name");
    }
    if (!email) {
      throw new Error("No email");
    }
    // 送り先idがない場合、送り先を作成
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_name: companyName ?? name,
        recipient_mail_address: email,
        recipient_title: companyName ? "御中" : "様",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create contact");
    }

    const contact = await response.json();
    return Number(contact.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * MISOCAの見積書を作成する
 *
 * @param token - MISOCAのOAuthトークン
 * @param estimateItems - 見積書のアイテム
 * @param contactId - MISOCAの送り先ID
 * @param companyName - 法人名
 * @param name - 名前
 * @param email - メールアドレス
 * @returns MISOCAの見積書ID
 */
export const makeEstimate = async (
  token: string,
  estimateItems: MisocaEstimateItem[],
  contactId: number
): Promise<number | null> => {
  try {
    // バリデーション
    if (estimateItems.length < 1) {
      throw new Error("Invalid estimate items");
    }

    // 日付を取得
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const response = await fetch(`${API_URL}/estimate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issue_date: formattedDate,
        contact_id: contactId,
        items: estimateItems,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create estimate");
    }
    const estimate = await response.json();
    return estimate.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendEstimate = async (
  token: string,
  id: string, // Estimateのid
  estimateId: number, // MISOCAの見積書id
  mailSubject: string, // メールの件名
  mailBody: string, // メールの本文
  includingSelfToCc: boolean
): Promise<string> => {
  const api_url = process.env.NEXT_PUBLIC_MISOCA_API_ENDPOINT;
  try {
    const body: Record<string, any> = {
      mail_subject: mailSubject,
      mail_body: mailBody,
      including_self_to_cc: includingSelfToCc,
    };

    const response = await fetch(`${api_url}/estimate/${estimateId}/distribute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to send a estimate by email");
    }
    // 送信日時を登録する
    const sentAt = dayjs().utc().format();
    await client.models.Estimate.update({
      id: id,
      mail_sent_at: sentAt,
    });

    return sentAt;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
