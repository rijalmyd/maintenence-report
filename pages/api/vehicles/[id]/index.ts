/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateVehicleSchema } from "@/schema/vehicleSchema";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const idStr = Array.isArray(id) ? id[0] : id;

  if (req.method === "GET") {
    try {
      const user = await prisma.vehicle.findUnique({
        where: { id: idStr },
        include: {
          asset: true,
        },
      });

      res.status(200).json(success(user));
    } catch (error: any) {
      res.status(500).json(fail("terjadi kesalahan server", error.message));
    }
  }
  if (req.method === "PATCH") {
    try {
      const body = UpdateVehicleSchema.parse(req.body);

      const user = await prisma.vehicle.update({
        where: {
          id: idStr,
        },
        data: {
          asset: {
            update: {
              asset_code: body.asset_code,
              is_active: body.is_active,
              asset_type: "VEHICLE",
              name: body.name,
              brand: body.brand,
              model: body.model,
              purchase_date: body.purchase_date,
              purchase_price: body.purchase_price,
              serrial_number: body.serial_number,
            },
          },
          color: body.color,
          engine_number: body.engine_number,
          frame_number: body.frame_number,
          kir_due_date: body.kir_due_date,
          license_plate: body.license_plate,
          no_kir: body.no_kir,
          stnk_due_date: body.stnk_due_date,
          year: body.year,
          notes: body.notes,
        },
        include: {
          asset: true,
        },
      });

      res.status(200).json(success(user));
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
  if (req.method === "DELETE") {
    try {
      await prisma.vehicle.delete({
        where: { id: idStr },
      });

      res.status(200).json(success(null));
    } catch (error: any) {
      res.status(500).json(fail("terjadi kesalahan server", error.message));
    }
  }
}

export default verifyToken(handler);
