import { RoomType } from "./MRoomType";

export interface MTimeBasedFeeItem {
  id: number;
  m_room_type_id: number;
  name: string;
  jst_check_in_time: string;
  jst_check_out_time: string;
  fee: number;
  is_weekday: boolean;
}

export const mTimeBasedFee: MTimeBasedFeeItem[] = [
  {
    id: 1,
    m_room_type_id: RoomType.Hall,
    name: "平日_09:00〜12:00",
    jst_check_in_time: "09:00",
    jst_check_out_time: "12:00",
    fee: 6600,
    is_weekday: true,
  },
  {
    id: 2,
    m_room_type_id: RoomType.Hall,
    name: "休日_09:00〜12:00",
    jst_check_in_time: "09:00",
    jst_check_out_time: "12:00",
    fee: 8400,
    is_weekday: false,
  },
  {
    id: 3,
    m_room_type_id: RoomType.Hall,
    name: "平日_12:00〜13:00",
    jst_check_in_time: "12:00",
    jst_check_out_time: "13:00",
    fee: 2200,
    is_weekday: true,
  },
  {
    id: 4,
    m_room_type_id: RoomType.Hall,
    name: "休日_12:00〜13:00",
    jst_check_in_time: "12:00",
    jst_check_out_time: "13:00",
    fee: 2800,
    is_weekday: false,
  },
  {
    id: 5,
    m_room_type_id: RoomType.Hall,
    name: "平日_13:00〜17:00",
    jst_check_in_time: "13:00",
    jst_check_out_time: "17:00",
    fee: 9800,
    is_weekday: true,
  },
  {
    id: 6,
    m_room_type_id: RoomType.Hall,
    name: "休日_13:00〜17:00",
    jst_check_in_time: "13:00",
    jst_check_out_time: "17:00",
    fee: 12800,
    is_weekday: false,
  },
  {
    id: 7,
    m_room_type_id: RoomType.Hall,
    name: "平日_17:00〜18:00",
    jst_check_in_time: "17:00",
    jst_check_out_time: "18:00",
    fee: 2700,
    is_weekday: true,
  },
  {
    id: 8,
    m_room_type_id: RoomType.Hall,
    name: "休日_17:00〜18:00",
    jst_check_in_time: "17:00",
    jst_check_out_time: "18:00",
    fee: 3500,
    is_weekday: false,
  },
  {
    id: 9,
    m_room_type_id: RoomType.Hall,
    name: "平日_18:00〜21:00",
    jst_check_in_time: "18:00",
    jst_check_out_time: "21:00",
    fee: 8100,
    is_weekday: true,
  },
  {
    id: 10,
    m_room_type_id: RoomType.Hall,
    name: "休日_18:00〜21:00",
    jst_check_in_time: "18:00",
    jst_check_out_time: "21:00",
    fee: 10500,
    is_weekday: false,
  },
  {
    id: 11,
    m_room_type_id: RoomType.Hall,
    name: "平日_21:00〜22:00",
    jst_check_in_time: "21:00",
    jst_check_out_time: "22:00",
    fee: 2700,
    is_weekday: true,
  },
  {
    id: 12,
    m_room_type_id: RoomType.Hall,
    name: "休日_21:00〜22:00",
    jst_check_in_time: "21:00",
    jst_check_out_time: "22:00",
    fee: 3500,
    is_weekday: false,
  },
  {
    id: 13,
    m_room_type_id: RoomType.Hall,
    name: "平日1日プラン",
    jst_check_in_time: "09:00",
    jst_check_out_time: "21:00",
    fee: 25000,
    is_weekday: true,
  },
  {
    id: 14,
    m_room_type_id: RoomType.Hall,
    name: "休日1日プラン",
    jst_check_in_time: "09:00",
    jst_check_out_time: "21:00",
    fee: 35000,
    is_weekday: false,
  },
] as const;
