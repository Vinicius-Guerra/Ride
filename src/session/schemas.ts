import { z } from "zod";

export const sessionPayloadSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(255),
});

export const sessionResponseSchema = z.object({
  token: z.string(),
});
