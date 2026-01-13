import { NextRequest, NextResponse } from "next/server";
import { MisocaEstimateItem } from "@repo/common-utils/interfaces";
import * as misoca from "../../../lib/misoca";

interface RequestBody {
  token: string;
  items: MisocaEstimateItem[];
  contactId: number;
}

export async function POST(request: NextRequest) {
  try {
    const { token, items, contactId }: RequestBody = await request.json();
    const estimateId = await misoca.makeEstimate(token, items, contactId);
    if (estimateId == null) {
      throw new Error("Failed to create misoca estimate");
    }
    return NextResponse.json({ estimateId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
