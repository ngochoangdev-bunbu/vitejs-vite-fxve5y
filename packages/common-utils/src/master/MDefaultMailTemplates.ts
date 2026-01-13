export enum MailType {
  Estimate = 0,
  ReservationCompleted,
  ReservationCancelled,
  Remind,
}

export interface MDefaultMailTemplateItem {
  id: number;
  mail_type: number;
  description?: string;
  subject: string;
  body: string;
}

export const mDefaultMailTemplates: MDefaultMailTemplateItem[] = [
  {
    id: 1,
    mail_type: MailType.Estimate,
    description: "見積もりメールテンプレート",
    subject: "見積もり情報",
    body: "見積もりメールのメッセージです。担当者：{{担当者}}、法人名：{{法人名}}、見積書・請求書宛て名：{{見積書・請求書宛て名}}",
  },
  {
    id: 2,
    mail_type: MailType.ReservationCompleted,
    description: "予約完了メールテンプレート",
    subject: "予約完了",
    body: "予約完了メールのメッセージ",
  },
  {
    id: 3,
    mail_type: MailType.ReservationCancelled,
    description: "予約キャンセルメールテンプレート",
    subject: "予約キャンセル",
    body: "予約キャンセルメールのメッセージ",
  },
  {
    id: 4,
    mail_type: MailType.Remind,
    description: "リマインドメールテンプレート",
    subject: "リマインド",
    body: "リマインドメールのメッセージです",
  },
] as const;
