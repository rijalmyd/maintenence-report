import {
  Asset,
  Driver,
  Image,
  MaintenenceSparepart,
  User,
} from "@/generated/prisma/client";

export type Maintenence = {
  id: string;
  record_number: string;
  user_id: string;
  complaint: string;
  repair_notes: string;
  driver_id: string;
  asset_id: string;
  km_asset: number;
  total_cost: number;
  labor_cost: number;
  spareparts_cost: number;
  asset_image_url: string;
  asset: Asset;
  driver: Driver;
  images: Image[];
  spareparts: MaintenenceSparepart[];
  user: User;
  createdAt: Date;
};
