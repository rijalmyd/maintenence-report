import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type GeneratedNumberOptions = {
  prefix: string;
  padLength: number;
  maxNumber: number;
};

export function getNextGeneratedNumber(
  last: string | undefined,
  { prefix, padLength, maxNumber }: GeneratedNumberOptions
): string {
  const lastNumber = last
    ? Number(last.replace(prefix, ""))
    : 0;

  if (!Number.isInteger(lastNumber)) {
    throw new Error("Invalid generated number format");
  }

  if (lastNumber >= maxNumber) {
    throw new Error("Generated number limit reached");
  }

  return `${prefix}${String(lastNumber + 1).padStart(padLength, "0")}`;
}

// utils/assetExcelMapper.ts
export const HEADER_MAP: Record<string, string> = {
  "NAMA CHASSIS": "chassis_name",
  "PEMILIK": "owner",
  "ALAMAT": "address",
  "MERK": "brand",
  "MODEL": "model",
  "JENIS CHASSIS": "chassis_type",
  "TIPE CHASSIS": "frame_type",
  "JUMLAH EXCEL": "axle_count",
  "TAHUN": "year",
  "TAHUN ASSEMBLY": "assembly_year",
  "CILINDER": "cylinder",
  "WARNA": "color",
  "NO RANGKA": "chassis_number",
  "NO MESIN": "engine_number",
  "NO BPKB": "bpkb_number",
  "BAHAN BAKAR": "fuel_type",
  "NO STNK": "stnk_number",
  "TGL STNK": "stnk_date",
  "TGL JTH TEMPO STNK": "stnk_expired",
  "KODE SUPIR": "driver_code",
  "TGL KIR": "kir_due_date",
  "NO KIR CHASSIS": "kir_number",
};
