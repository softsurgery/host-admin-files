import { z } from "zod";

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name is too long"),
  key: z.string().min(1, "Key is required"),
  workspace_id: z
    .number({
      required_error: "Workspace must be selected",
    })
});
