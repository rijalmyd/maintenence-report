/**
 * Handle error dari axios, fetch, atau error biasa.
 * Bisa dipakai global di mutation / query TanStack.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/errorHandler.ts
export function handleApiError(error: unknown, customMessage?: string) {
  let message = "Terjadi kesalahan";

  if (typeof error === "object" && error !== null && "response" in error) {
    const resp: any = (error as any).response;
    message = resp?.data?.message ?? (error as any).message ?? message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // pastikan toast hanya dijalankan di browser
  if (typeof window !== "undefined") {
    import("sonner").then(({ toast }) => {
      toast.error(customMessage ? `${customMessage}, ${message}` : message);
    });
  }

  console.error("[API ERROR]", message, error);
}
