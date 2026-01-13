import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
    User: a
      .model({
        id: a.id().required(),
        name: a.string().required(),
        company_name: a.string(),
        tel: a.string().required(),
        email: a.string().required(),
        misoca_contact_group_id: a.integer(),
        misoca_contact_id: a.integer(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.guest().to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["id"])
      .authorization((allow) => [allow.guest().to(["create"]), allow.owner(), allow.groups(["ADMINS"])]),

    Estimate: a
      .model({
        id: a.id().required(),
        user_id: a.id(),
        name: a.string(),
        company_name: a.string(),
        estimate_name: a.string(),
        tel: a.string(),
        email: a.string(),
        mail_sent_at: a.datetime(),
        misoca_estimate_id: a.integer(),
        payment_method: a.string(),
        message: a.string(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.authenticated("identityPool").to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["create"]),
        allow.authenticated("identityPool").to(["create"]),
        allow.owner(),
        allow.groups(["ADMINS"]),
      ]),

    Reservation: a
      .model({
        id: a.id().required(),
        estimates_id: a.id().required(),
        m_room_type_id: a.integer().required(),
        check_in: a.datetime().required(),
        check_out: a.datetime().required(),
        is_all_day: a.boolean().required(),
        base_fee: a.integer().required(),
        companions: a.integer().required(),
        contact_name: a.string(),
        contact_email: a.string(),
        entry: a.datetime(),
        canceled_date: a.datetime(),
        google_calendar_event_id: a.string(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.authenticated("identityPool").to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["create"]),
        allow.authenticated("identityPool").to(["create"]),
        allow.owner(),
        allow.groups(["ADMINS"]),
      ]),

    Option: a
      .model({
        id: a.id().required(),
        reservation_id: a.id().required(),
        m_option_id: a.integer().required(),
        quantity: a.integer().required(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.authenticated("identityPool").to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["create"]),
        allow.authenticated("identityPool").to(["create"]),
        allow.owner(),
        allow.groups(["ADMINS"]),
      ]),

    Survey: a
      .model({
        estimate_id: a.id().required(),
        m_survey_id: a.integer().required(),
        other: a.string(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.authenticated("identityPool").to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["estimate_id", "m_survey_id"])
      .authorization((allow) => [
        allow.guest().to(["create"]),
        allow.authenticated("identityPool").to(["create"]),
        allow.owner(),
        allow.groups(["ADMINS"]),
      ]),

    UsagePurpose: a
      .model({
        estimate_id: a.id().required(),
        m_usage_purpose_id: a.integer().required(),
        other: a.string(),
        owner: a
          .string()
          .authorization((allow) => [
            allow.authenticated("identityPool").to(["create"]),
            allow.owner().to(["read", "delete"]),
            allow.groups(["ADMINS"]),
          ]),
      })
      .identifier(["estimate_id", "m_usage_purpose_id"])
      .authorization((allow) => [
        allow.guest().to(["create"]),
        allow.authenticated("identityPool").to(["create"]),
        allow.owner(),
        allow.groups(["ADMINS"]),
      ]),

    MSurvey: a
      .model({
        id: a.integer().required(),
        name: a.string().required(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),

    MRoomType: a
      .model({
        id: a.integer().required(),
        name: a.string().required(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),

    MOption: a
      .model({
        id: a.string().required(),
        m_room_type_id: a.integer().required(),
        name: a.string().required(),
        option_fee: a.integer().required(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),

    MTimeBasedFee: a
      .model({
        id: a.integer().required(),
        m_room_type_id: a.integer().required(),
        name: a.string().required(),
        jst_check_in_time: a.string().required(),
        jst_check_out_time: a.string().required(),
        fee: a.integer().required(),
        is_weekday: a.boolean().required(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),

    MUsageBasedFee: a
      .model({
        id: a.integer().required(),
        m_room_type_id: a.integer().required(),
        name: a.string().required(),
        hourly_fee: a.integer(),
        max_fee: a.integer(),
        is_weekday: a.boolean().required(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),

    MailTemplates: a
      .model({
        id: a.integer().required(),
        title: a.string().required(),
        message: a.string().required(),
        description: a.string(),
      })
      .identifier(["id"])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated("identityPool").to(["read"]),
        allow.groups(["ADMINS"]),
      ]),
  })
  .authorization((allow) => [allow.groups(["ADMINS"])]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
