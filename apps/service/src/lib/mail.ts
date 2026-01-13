import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export interface SendEmailParam {
  from: string; //環境に応じて変わる e.g "test@obiya-guild.biz"
  /**
   * to, cc, bccは
   * 以下のフォーマット対応
   * ["test1@email.com", "test2@email.com"]
   */
  to: string[]; // 送信先メールアドレス
  cc?: string[];
  bcc?: string[];
  subject: string; // メール件名
  body: string; // メール本文
}

const sesClient = new SESv2Client({});

const processAddress = (addresses?: string[]): string[] | undefined => {
  if (!addresses) {
    return undefined;
  }

  return addresses.filter((addr) => addr);
};

/**
 * 同期的にメール送信
 *
 * @param params メール送信パラメータ
 * @returns SendEmailの実行結果
 * @throws SendEmailの呼び出しに失敗した場合はエラーをスロー
 *
 * 注意：この関数は実行完了まで待機するため、メール送信の成功/失敗を確認できますが、
 *      レスポンス時間が長くなる可能性があります。
 */
export async function sendEmailSync(params: SendEmailParam) {
  const { from, to, subject, body, cc, bcc } = params;

  const toAddresses = processAddress(to);
  if (!toAddresses || toAddresses.length === 0) {
    return;
  }

  const command = new SendEmailCommand({
    FromEmailAddress: from,
    Destination: {
      ToAddresses: toAddresses,
      CcAddresses: processAddress(cc),
      BccAddresses: processAddress(bcc),
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: body,
            Charset: "UTF-8",
          },
        },
      },
    },
  });

  const result = await sesClient.send(command);
  return result;
}

/**
 * 非同期でメール送信
 *
 * @param params メール送信パラメータ
 * @returns SendEmailの呼び出しレスポンス（実行結果ではない）
 * @throws SendEmailの呼び出しに失敗した場合はエラーをスロー
 *
 * 注意：この関数は即座にレスポンスを返すため高速ですが、
 *      メール送信の成功/失敗は確認できません。
 */
export function sendEmailAsync(params: SendEmailParam): void {
  const { from, to, subject, body, cc, bcc } = params;

  const toAddresses = processAddress(to);

  if (!toAddresses || toAddresses.length === 0) {
    return;
  }

  const command = new SendEmailCommand({
    FromEmailAddress: from,
    Destination: {
      ToAddresses: toAddresses,
      CcAddresses: processAddress(cc),
      BccAddresses: processAddress(bcc),
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: body,
            Charset: "UTF-8",
          },
        },
      },
    },
  });

  sesClient.send(command).catch((error) => {
    console.error("Failed to send email", error);
  });
}
