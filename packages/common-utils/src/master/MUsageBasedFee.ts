import { RoomType } from "./MRoomType";

export interface MUsageBasedFeeItem {
  id: number;
  m_room_type_id: number;
  name: string;
  hourly_fee: number;
  max_fee: number | null;
  is_weekday: boolean;
}

export const mUsageBasedFee: MUsageBasedFeeItem[] = [
  {
    id: 1,
    m_room_type_id: RoomType.CoworkingSpace,
    name: "コワーキングスペース_休日料金",
    hourly_fee: 500,
    max_fee: 1500,
    is_weekday: false,
  },
  {
    id: 2,
    m_room_type_id: RoomType.CoworkingSpace,
    name: "コワーキングスペース_平日料金",
    hourly_fee: 500,
    max_fee: 1500,
    is_weekday: true,
  },
  {
    id: 3,
    m_room_type_id: RoomType.MeetingRoomSmall,
    name: "小会議室_休日料金",
    hourly_fee: 1500,
    max_fee: null,
    is_weekday: false,
  },
  {
    id: 4,
    m_room_type_id: RoomType.MeetingRoomSmall,
    name: "小会議室_平日料金",
    hourly_fee: 1500,
    max_fee: null,
    is_weekday: true,
  },
  {
    id: 5,
    m_room_type_id: RoomType.MeetingRoomMedium,
    name: "中会議室_休日料金",
    hourly_fee: 2000,
    max_fee: null,
    is_weekday: false,
  },
  {
    id: 6,
    m_room_type_id: RoomType.MeetingRoomMedium,
    name: "中会議室_平日料金",
    hourly_fee: 2000,
    max_fee: null,
    is_weekday: true,
  },
] as const;
