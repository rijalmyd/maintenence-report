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
