import z from "zod";

export const CreateMaintenenceSchma = z.object({
  asset_id: z.string(),
  driver_id: z.string(),
  asset_image_url: z.string(),
  repair_image_urls: z.array(z.string()),
  km_asset: z.number(),
  sparepart_ids: z.array(z.string()),
  complaint: z.string(),
  repair_plan: z.string(),
});
