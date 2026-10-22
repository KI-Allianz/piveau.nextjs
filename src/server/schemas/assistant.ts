import { z } from "zod";

export const AssistantParamsSchema = z.object({
  user_input: z.string().min(1).max(4000),
  json_data: z.string(),
  session_id: z.string().min(1),
});
