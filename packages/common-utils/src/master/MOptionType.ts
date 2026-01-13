import { RoomType } from "./MRoomType";

export interface MOptionTypeItem {
  id: number;
  m_room_type_id: number;
  name: string;
  option_fee: number;
  variable?: boolean; // 数量可変オプションかどうか
}

export const mOptionType: MOptionTypeItem[] = [
  {
    id: 1,
    m_room_type_id: RoomType.Hall,
    name: "プロジェクター 短焦点1m ベンキュー MW826STH",
    option_fee: 5000,
  },
  {
    id: 2,
    m_room_type_id: RoomType.Hall,
    name: "飲食後のゴミ回収（ゴミ袋4袋まで）",
    option_fee: 3000,
    variable: true,
  },
  {
    id: 3,
    m_room_type_id: RoomType.Hall,
    name: "宅配便の現地受け取り",
    option_fee: 3000,
  },
  {
    id: 4,
    m_room_type_id: RoomType.Hall,
    name: "宅配便を現地から発送（荷造り済みの荷物を着払いで発送します。）",
    option_fee: 3000,
  },
] as const;
