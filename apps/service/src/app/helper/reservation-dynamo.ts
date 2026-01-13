import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { RoomType } from "@repo/common-utils/master";
import {
  MeetingDetail,
  MeetingFormValues,
} from "@/interfaces/form-meeting-reservation";
import { HallDetail, HallFormValues } from "@/interfaces/form-hall-reservation";

export const createMeeting = async (
  estimateId: string,
  eventIds: string[],
  formData: MeetingFormValues,
) => {
  const createReservationPromises = formData.details.map(
    async (detail: MeetingDetail, index: number) => {
      const createReservation: any = {
        estimates_id: estimateId,
        m_room_type_id: RoomType.MeetingRoomSmall,
        check_in: detail.startDateTimeISO,
        check_out: detail.endDateTimeISO,
        companions: detail.totalGuests,
        base_fee: detail.fee,
        is_all_day: detail.isAllDay,
        google_calendar_event_id: eventIds[index],
        ...(detail.contactName && {
          contact_name: detail.contactName,
        }),
        ...(detail.contactEmail && {
          contact_email: detail.contactEmail,
        }),
        ...(formData.user.id && {
          owner: formData.user.id,
        }),
      };

      return cookieBasedClient.models.Reservation.create(createReservation, {
        authMode: "identityPool",
      });
    },
  );
  await Promise.all(createReservationPromises);
};

export const createHall = async (
  estimateId: string,
  eventIds: string[],
  formData: HallFormValues,
): Promise<string[]> => {
  const createReservationPromises = formData.details.map(
    async (detail: HallDetail, index: number) => {
      const createReservation: any = {
        estimates_id: estimateId,
        m_room_type_id: RoomType.Hall,
        check_in: detail.startDateTimeISO,
        check_out: detail.endDateTimeISO,
        companions: detail.totalGuests,
        entry: detail.entryDateTimeISO,
        base_fee: detail.fee,
        is_all_day: detail.isAllDay,
        google_calendar_event_id: eventIds[index],
        ...(detail.contactName && {
          contact_name: detail.contactName,
        }),
        ...(detail.contactEmail && {
          contact_email: detail.contactEmail,
        }),
        ...(formData.user.id && {
          owner: formData.user.id,
        }),
      };

      return cookieBasedClient.models.Reservation.create(createReservation, {
        authMode: "identityPool",
      });
    },
  );
  const createdReservations = await Promise.all(createReservationPromises);
  const ids: string[] = createdReservations.map((item) =>
    item.data != null ? item.data.id : "",
  );
  return ids;
};
