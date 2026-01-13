export enum RoomType {
  CoworkingSpace = 1,
  Hall,
  MeetingRoomSmall,
  MeetingRoomMedium,
}

export interface MRoomTypeItem {
  id: number;
  room_type: number;
  name: string;
}

export const mRoomType: MRoomTypeItem[] = [
  {
    id: 1,
    room_type: RoomType.CoworkingSpace,
    name: "コワーキングスペース",
  },
  {
    id: 2,
    room_type: RoomType.Hall,
    name: "ホール",
  },
  {
    id: 3,
    room_type: RoomType.MeetingRoomSmall,
    name: "小会議室",
  },
  {
    id: 4,
    room_type: RoomType.MeetingRoomMedium,
    name: "中会議室",
  },
] as const;
