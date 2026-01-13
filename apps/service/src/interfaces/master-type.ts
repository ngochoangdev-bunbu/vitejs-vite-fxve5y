export interface MRoomType {
  id: number;
  room_type: number;
  name: string;
}

export interface MTimeBasedFee {
  id: number;
  m_room_type_id: number;
  name: string;
  jst_check_in_time: string;
  jst_check_out_time: string;
  fee: number;
  is_weekday: boolean;
}

export interface MUsageBasedFee {
  id: number;
  m_room_type_id: number;
  name: string;
  hourly_fee: number;
  max_fee: number | null;
  is_weekday: boolean;
}

export interface MUsagePurpose {
  id: number;
  name: string;
}
