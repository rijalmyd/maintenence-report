/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateSparepartSchema } from "@/schema/sparepartSchema";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const spareparts = await prisma.sparepart.findMany({
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(success(spareparts));
      }
      case "POST": {
        const body = CreateSparepartSchema.parse(req.body);

        const sparepart = await prisma.sparepart.create({
          data: {
            code: body.code,
            name: body.name,
            price: body.price,
            stock_quantity: body.stock_quantity,
            unit: body.unit,
            description: body.description,
          },
        });

        return res.status(201).json(success(sparepart));
      }
      default:
        return res.status(405).json(fail("Method not allowed"));
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("API error:", error);
    return res
      .status(500)
      .json(fail("Terjadi kesalahan server", error.message));
  }
}

export default verifyToken(handler);
