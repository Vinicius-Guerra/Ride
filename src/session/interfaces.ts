import { z } from "zod";
import { sessionPayloadSchema, sessionResponseSchema } from "./schemas";

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
