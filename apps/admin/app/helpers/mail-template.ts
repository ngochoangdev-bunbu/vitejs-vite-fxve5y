import { generateClient } from "aws-amplify/api";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { mDefaultMailTemplates } from "@repo/common-utils/master";

interface MailTemplate {
  title: string;
  message: string;
}

const client = generateClient<Schema>();

export async function getMailTemplate(id: number): Promise<MailTemplate> {
  const response = await client.models.MailTemplates.get({ id });

  if (response.data) {
    return {
      title: response.data.title,
      message: response.data.message,
    };
  }

  const defaultTemplate = mDefaultMailTemplates.find((t => t.id === id));
  if (defaultTemplate) {
    return {
      title: defaultTemplate.subject,
      message: defaultTemplate.body,
    };
  }

  throw new Error("Mail template not found");
}
