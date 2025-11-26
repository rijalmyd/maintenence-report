/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateVehicleSchema } from "@/schema/vehicleSchema";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = CreateVehicleSchema.parse(req.body);

      const vehicle = await prisma.vehicle.create({
        data: {
          asset: {
            create: {
              asset_code: body.asset.asset_code,
              is_active: true,
              asset_type: "VEHICLE",
              name: body.asset.name,
              brand: body.asset.brand,
              model: body.asset.model,
              purchase_date: body.asset.purchase_date,
              purchase_price: body.asset.purchase_price,
              serrial_number: body.asset.serial_number,
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

  if (req.method === "GET") {
    try {
      const drivers = await prisma.vehicle.findMany({
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
