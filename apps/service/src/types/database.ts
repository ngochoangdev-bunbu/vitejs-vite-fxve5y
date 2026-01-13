export interface Option {
  title: string; //オプション名
  number: number; //数量
  price: number; //料金
}

export interface BaseReservation {
  room_type_id: number;
  user_id?: string;
  contact_name?: string; //お名前
  company_name?: string; //法人名
  recipient_name?: string; //見積書・請求書宛て名
  email: string; //連絡先のメールアドレス
  tel: string; //連絡先の電話番号
  misoca_estimate_id?: string; //MISOCAの見積書ID
  payment_method: string; //支払い方法
  contact_note?: string; //連絡事項
  purposes?: string[]; //利用用途
  survey?: string[]; //アンケート:答えの配列のみ
}

export interface BaseBooking {
  reservationId?: string; // To link back to the parent Reservation
  room_type_id: number;
  google_calendar_event_id?: string;
  canceled_at?: string; //キャンセル時刻 ISO 8601 e.g2025-08-25T22:10:17+09:00
  start_time: string; //開始時刻 ISO 8601 e.g2025-08-25T22:10:17+09:00
  end_time: string; //終了時刻 ISO 8601 e.g2025-08-25T22:10:17+09:00
  enter_time?: string; //入室時刻 ISO 8601 e.g2025-08-25T22:10:17+09:00
  number_of_participants: number; //利用人数
  email: string; //連絡先のメールアドレス
  person_in_charge?: string; //当日担当者
  person_in_charge_email?: string; //当日担当者メール
  options?: Option[]; //オプション
}

interface StoredEntity {
  PK: string; // Primary Partition Key
  SK: string; // Primary Sort Key
  entityType: string; // The discriminator
  created_at: string; // ISO 8601 e.g2025-08-25T22:10:17+09:00

  // GSI for querying reservations by user
  userPK?: string;

  // GSI for querying bookings time
  bookdatePK?: string;
  bookdateSK?: string;

  // GSI for sort
  allReservationsPK?: string;
}

/**
 * The Reservation entity as it's stored in DynamoDB.
 */
export type StoredReservation = BaseReservation &
  StoredEntity & {
    entityType: "Reservation";
  };

/**
 * The Booking entity as it's stored in DynamoDB.
 */
export type StoredBooking = BaseBooking &
  StoredEntity & {
    entityType: "Booking";
  };

/**
 * A discriminated union of all possible entity types
 * This allows for type-safe handling of any item fetched from DynamoDB
 */
export type AnyEntity = StoredReservation | StoredBooking;

export interface PaginatedReservations {
  items: {
    reservation: StoredReservation;
    bookings: StoredBooking[];
  }[];
  nextToken?: string;
}

export interface PaginatedUserReservations extends PaginatedReservations {}

export interface PaginatedBookings {
  items: StoredBooking[];
  nextToken?: string;
}
