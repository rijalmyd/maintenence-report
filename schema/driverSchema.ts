import z from "zod";

export const CreateDriverSchema = z.object({
  name: z.string(),
  phone: z.string(),
  notes: z.string().optional(),
});

export const UpdateDriverSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
});
