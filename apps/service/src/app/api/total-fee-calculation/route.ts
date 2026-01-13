import { NextRequest, NextResponse } from "next/server";
import { RoomType } from "@repo/common-utils/master";
import {
  calcHallTotalFee,
  calcMeetingTotalFee,
} from "@/app/helper/fee-calculation";
import { FormBooking } from "@repo/common-utils/interfaces";

interface RequestBody {
  bookings: FormBooking[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { bookings } = body;

    if (bookings.length < 1 || !bookings[0]) throw new Error("No booking data");

    if (
      bookings[0].roomTypeId === RoomType.MeetingRoomSmall ||
      bookings[0].roomTypeId === RoomType.MeetingRoomMedium
    ) {
      const totalFee = await calcMeetingTotalFee(bookings);
      return NextResponse.json({ totalFee }, { status: 200 });
    }
    if (bookings[0].roomTypeId === RoomType.Hall) {
      const totalFee = await calcHallTotalFee(bookings);
      return NextResponse.json({ totalFee }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid room type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
