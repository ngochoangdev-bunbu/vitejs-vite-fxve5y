import { BaseReservation } from "@/types/database";
import { MailType, MDefaultMailTemplateItem, mDefaultMailTemplates } from "@repo/common-utils/master";
import { sendEmailAsync } from "@/lib/mail";

function replacePlaceholders(
  reservationData: BaseReservation,
  originalTemplate: MDefaultMailTemplateItem,
) {
  const result = Object.assign({}, originalTemplate);

  const {
    contact_name, // 担当者名
    company_name, // 法人名
    recipient_name, // 見積書・請求書宛て名
  } = reservationData;

  // Subject
  contact_name && result.subject.replaceAll("{{担当者}}", contact_name);
  company_name && result.subject.replaceAll("{{法人名}}", company_name);
  recipient_name &&
    result.subject.replaceAll("{{見積書・請求書宛て名}}", recipient_name);

  // Body
  contact_name && result.body.replaceAll("{{担当者}}", contact_name);
  company_name && result.body.replaceAll("{{法人名}}", company_name);
  recipient_name &&
    result.body.replaceAll("{{見積書・請求書宛て名}}", recipient_name);

  return result;
}

/**
 * 予約完了メール送信
 * @param reservationData 予約データ
 */
export async function sendReservationCompletedEmail(
  reservationData: BaseReservation,
) {
  const { email } = reservationData;

  // TODO: DynamoDBのメールテンプレートを参照するように修正
  const templateData = mDefaultMailTemplates.find(
    (item) => item.mail_type === MailType.ReservationCompleted,
  );

  if (!templateData) {
    throw new Error("No email template found");
  }

  const mail = replacePlaceholders(reservationData, templateData);

  return await sendEmailAsync({
    from: process.env.MAIL_SENDER_ADDRESS ?? "info@obiya-guild.biz",
    to: [email],
    subject: mail.subject,
    body: mail.body,
  });
}
