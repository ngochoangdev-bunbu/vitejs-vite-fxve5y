import { NextRequest, NextResponse } from "next/server";
import * as misoca from "../../../lib/misoca";

interface RequestBody {
  token: string;
  companyName?: string | null;
  name?: string | null;
  email?: string | null;
}

export async function POST(request: NextRequest) {
  try {
      const { token, companyName, name, email }: RequestBody = await request.json();
      const contactId = await misoca.makeContact(token, companyName, name, email);
      return NextResponse.json({ contactId }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }
}
