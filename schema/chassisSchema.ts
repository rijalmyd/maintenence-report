import z from "zod";
import { CreateAssetSchema } from "./assetSchema";

export const CreateChessisSchema = z.object({
  asset: CreateAssetSchema,
  // chassis
  chassis_number: z.string(),
  chassis_category: z.string(),
  chassis_type: z.enum(["RANGKA", "FLATBED"]),
  axle_count: z.number(),
  no_kir: z.string(),
  kir_due_date: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date
          ? new Date(val)
          : undefined,
      z.date()
    )
    .optional(),
  notes: z.string().optional(),
});

export const UpdateChassisSchema = z.object({
  // asset
  asset_code: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  purchase_date: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date
          ? new Date(val)
          : undefined,
      z.date()
    )
    .optional(),
  purchase_price: z.number().optional(),
  is_active: z.boolean().optional(),

  // chassis
  chassis_number: z.string().optional(),
  chassis_category: z.string().optional(),
  chassis_type: z.enum(["RANGKA", "FLATBED"]).optional(),
  axle_count: z.number().optional(),
  no_kir: z.string().optional(),
  kir_due_date: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date
          ? new Date(val)
          : undefined,
      z.date()
    )
    .optional(),
  notes: z.string().optional(),
});
