import { type NextRequest, NextResponse } from "next/server";
import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { OptionRecord } from "@/interfaces/option-record";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const reservationId = searchParams.get("reservationId");
    if (!reservationId) throw new Error("invalid reservation id");

    // DynamoDBからデータを取得する
    const options = await cookieBasedClient.models.Option.list({
      filter: {
        reservation_id: { eq: reservationId },
      },
    });

    const mOptions = await cookieBasedClient.models.MOption.list();

    // データ整形処理
    const formattedData: OptionRecord[] = [];
    for (const item of options.data) {
      const record: OptionRecord = {
        id: item.id,
        reservationId: item.reservation_id,
        mOptionId: item.m_option_id,
        mOptionName:
          mOptions.data.find((i) => i.id === item.m_option_id.toString())
            ?.name || "",
        mOptionFee: mOptions.data.find(
          (i) => i.id === item.m_option_id.toString(),
        )?.option_fee,
        quantity: item.quantity,
        owner: item.owner,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      formattedData.push(record);
    }

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
