/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateChessisSchema } from "@/schema/chassisSchema";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    try {
      const body = CreateChessisSchema.parse(req.body);

      const vehicle = await prisma.chassis.create({
        data: {
          asset: {
            create: {
              asset_code: body.asset.asset_code,
              is_active: true,
              asset_type: "CHASSIS",
              name: body.asset.name,
              brand: body.asset.brand,
              model: body.asset.model,
              purchase_date: body.asset.purchase_date,
              purchase_price: body.asset.purchase_price,
              serrial_number: body.asset.serial_number,
            },
          },

          chassis_number: body.chassis_number,
          chassis_type: body.chassis_type,
          axle_count: body.axle_count,
          chassis_category: body.chassis_category,
          kir_due_date: body.kir_due_date,
          no_kir: body.no_kir,
          notes: body.notes,
        },
        include: {
          asset: true,
        },
      });

      res.status(201).json(success(vehicle));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors: error.flatten().fieldErrors,
        });
      }
      console.log(error);
      res.status(500).json(fail("terjadi kesalahan server"));
    }
  }

  if (req.method == "GET") {
    try {
      const drivers = await prisma.chassis.findMany({
        include: {
          asset: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(success(drivers));
    } catch (error: any) {
      res.status(500).json(fail("terjadi kesalahan server", error.message));
    }
  }
}

export default verifyToken(handler);
