import { google } from "googleapis";

// TODO: ADD MORE...
export interface SheetRecord {
  name: string; // 名前
  email: string; // メールアドレス
  companyName: string; // 法人名
  address: string; // 宛名
  tel: string; // 電話番号
  date: string; // 予約日付
  startTime: string; // 開始時刻
  endTime: string; // 終了時刻
}

export const logsInsert = async (records: SheetRecord[]) => {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"],
  );

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    if (
      response.data.sheets == null ||
      response.data.sheets[0].properties == null
    ) {
      throw new Error("no sheets");
    }

    // シート名を取得
    const range = response.data.sheets[0].properties.title;
    if (!range) {
      throw new Error("invalid range");
    }

    const timestamp = new Date().toISOString();

    // 先に内容をチェックする
    for (const record of records) {
      // TODO: 他の必須項目も確認
      if (!record.name || !record.email) {
        throw new Error("invalid schema");
      }
    }

    // ログ追加
    for (const record of records) {
      // TODO: interface対応
      const values = [timestamp, record.name, record.email];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values: [values],
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
