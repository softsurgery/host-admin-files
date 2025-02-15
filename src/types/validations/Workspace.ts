import { z } from "zod";
export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
});
