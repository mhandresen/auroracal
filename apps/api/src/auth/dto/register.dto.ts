import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
  timezone: z.string().min(1).max(60).optional(),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
