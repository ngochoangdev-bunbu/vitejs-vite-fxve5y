import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { OptionRecord } from "@repo/common-utils/interfaces";
import { mOptionType } from "@repo/common-utils/master";

const client = generateClient<Schema>();

export async function getOptions(reservationId: string): Promise<OptionRecord[]> {
  // DynamoDBからデータを取得する
  const options = await client.models.Option.list({
    filter: { reservation_id: { eq: reservationId } },
  });

  // データ整形処理
  const formattedData: OptionRecord[] = [];
  for (const item of options.data) {
    const record: OptionRecord = {
      id: item.id,
      reservationId: item.reservation_id,
      mOptionId: item.m_option_id,
      mOptionName: mOptionType.data.find((i) => i.id === item.m_option_id.toString())?.name || "",
      mOptionFee: mOptionType.data.find((i) => i.id === item.m_option_id.toString())?.option_fee,
      quantity: item.quantity,
      owner: item.owner,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    formattedData.push(record);
  }

  return formattedData;
}
