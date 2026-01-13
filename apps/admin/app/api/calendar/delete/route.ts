import { NextRequest, NextResponse } from "next/server";
import { calendarHelper } from "@repo/common-utils/helpers";
import { RoomType } from "@repo/common-utils/master";

interface RequestBody {
  roomTypeId?: number;
  googleCalendarEventId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { roomTypeId, googleCalendarEventId }: RequestBody = await request.json();

    if (!roomTypeId || !googleCalendarEventId) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    switch (roomTypeId) {
      case RoomType.MeetingRoomSmall:
      case RoomType.MeetingRoomMedium:
        await calendarHelper.deleteMeeting(googleCalendarEventId, roomTypeId);
        break;
      case RoomType.Hall:
        await calendarHelper.deleteHall(googleCalendarEventId);
        break;
      default:
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
