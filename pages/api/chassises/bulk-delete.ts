/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DeleteChassisBulkSchema } from "@/schema/chassisSchema";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json(fail("Method not allowed"));
  }

  try {
    const { ids } = DeleteChassisBulkSchema.parse(req.body);

    // OPTIONAL: pastikan semua chassis ada
    const existing = await prisma.chassis.count({
      where: { id: { in: ids } },
    });

    if (existing === 0) {
      return res.status(404).json(fail("Chassis not found"));
    }

    // ✅ SAMA dengan delete satuan → hanya delete chassis
    const deleted = await prisma.chassis.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return res.status(200).json(
      success({
        deletedCount: deleted.count,
      })
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("Bulk delete error:", error);
    return res
      .status(500)
      .json(fail("Terjadi kesalahan server", error.message));
  }
}

export default verifyToken(handler);
