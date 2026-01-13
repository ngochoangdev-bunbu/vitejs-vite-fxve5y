import { cookieBasedClient } from "@/utils/amplifyServerUtils";
import { HallDetailOption, HallFormValues } from "@/interfaces/form-hall-reservation";

export const create = async (reservationIds: string[], formData: HallFormValues) => {
  for (const [index, reservationId] of reservationIds.entries()) {
    const options: HallDetailOption[] = formData.details[index].options ?? [];
    for (const option of options) {
      if (!option.value) continue;
      const createOption: any = {
        reservation_id: reservationId,
        m_option_id: option.mOptionsId,
        quantity: option.count,
        ...(formData.user.id && {
          owner: formData.user.id,
        }),
      };
      await cookieBasedClient.models.Option.create(createOption, {
        authMode: "identityPool",
      });
    }
  }
};
