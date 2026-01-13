
import { createServerRunner } from "@aws-amplify/adapter-nextjs";

import outputs from "@repo/amplify-backend/amplify_outputs.json"

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

