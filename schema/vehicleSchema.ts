import z from "zod";
import { CreateAssetSchema } from "./assetSchema";

export const CreateVehicleSchema = z.object({
  // asset
  asset: CreateAssetSchema,

  // vehicle
  license_plate: z.string().optional(),
  vehicle_type: z.string().optional(),
  color: z.string().optional(),
  year: z.number().optional(),
  engine_number: z.string().optional(),
  frame_number: z.string().optional(),
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
  stnk_due_date: z
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

export const UpdateVehicleSchema = z.object({
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
  // vehicle
  license_plate: z.string().optional(),
  vehicle_type: z.string().optional(),
  color: z.string().optional(),
  year: z.number().optional(),
  engine_number: z.string().optional(),
  frame_number: z.string().optional(),
  no_kir: z.string().optional(),
  is_active: z.boolean().optional(),
  kir_due_date: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date()
  ).optional(),
  stnk_due_date: z
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
