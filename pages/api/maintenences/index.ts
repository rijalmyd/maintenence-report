/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@/generated/prisma/client";
import { fail, success } from "@/lib/apiResponse";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateMaintenenceSchma } from "@/schema/maintenenceSchema";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const {
          page = 1,
          size = 10,
          search = "",
          startDate,
          endDate,
        } = req.query;

        const skip = (Number(page) - 1) * Number(size);
        const take = Number(size);

        const searchFilter: Prisma.MaintenenceWhereInput = search
          ? {
              OR: [
                {
                  record_number: {
                    contains: search as string,
                  },
                },
                {
                  complaint: {
                    contains: search as string,
                  },
                },
                {
                  repair_notes: {
                    contains: search as string,
                  },
                },
                {
                  asset: {
                    name: { contains: search as string },
                  },
                },
                {
                  driver: {
                    name: { contains: search as string },
                  },
                },
              ],
            }
          : {};

        // Build filter untuk tanggal created_at
        let dateFilter: Prisma.MaintenenceWhereInput = {};

        if (startDate && endDate) {
          dateFilter = {
            createdAt: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          };
        } else if (startDate) {
          // hanya start date
          dateFilter = {
            createdAt: {
              gte: new Date(startDate as string),
            },
          };
        } else if (endDate) {
          // hanya end date
          dateFilter = {
            createdAt: {
              lte: new Date(endDate as string),
            },
          };
        }

        // gabungkan semua filter
        const where: Prisma.MaintenenceWhereInput = {
          AND: [searchFilter, dateFilter],
        };

        // Hitung total untuk pagination
        const total = await prisma.maintenence.count({ where });

        const maintenences = await prisma.maintenence.findMany({
          where,
          skip,
          take,
          include: {
            asset: {
              include: {
                chassis: true,
                equipment: true,
                vehicle: true,
              },
            },
            driver: true,
            images: {
              include: {
                image: true,
              },
            },
            spareparts: {
              include: {
                sparepart: true,
              },
            },
            user: true,
          },
          orderBy: { createdAt: "desc" },
        });

        // transform data agar images tidak berisi pivot
        const formatted = maintenences.map((m) => ({
          ...m,
          images: m.images?.map((pivot) => pivot.image), // ambil langsung objek image-nya
          // spareparts: m.spareparts?.map((pivot) => pivot.sparepart),
        }));

        return res.status(200).json({
          success: true,
          message: success,
          data: formatted,
          pagging: {
            total,
            page: Number(page),
            size: Number(size),
            totalPages: Math.ceil(total / Number(size)),
          },
        });
      }
      case "POST": {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer "))
          return res.status(401).json(fail("unathorized"));

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          username: string;
        };

        const body = CreateMaintenenceSchma.parse(req.body);

        const laborCost = 0;
        let sparepartCost = 0;

        // find driver
        const driver = body.driver_id
          ? await prisma.driver.findUnique({
              where: {
                id: body.driver_id,
              },
            })
          : null;

        // if (!driver) {
        //   return res.status(400).json(fail("driver not found"));
        // }

        // find sparepart
        await Promise.all(
          body.spareparts.map(async (sparepartInput) => {
            // get sparepart
            const sparepart = await prisma.sparepart.findUnique({
              where: {
                id: sparepartInput.id,
              },
            });

            if (!sparepart) {
              return res.status(400).json(fail("sparepart not found"));
            }

            const totalPrice = sparepart.price * sparepartInput.quantity;

            sparepartCost += totalPrice;
          })
        );

        const totalCost = sparepartCost + laborCost;

        const createImages = await Promise.all(
          body.repair_image_urls.map((url) =>
            prisma.image.create({
              data: {
                url,
              },
            })
          )
        );

        const maintenence = await prisma.maintenence.create({
          data: {
            asset_image_url: body.asset_image_url,
            complaint: body.complaint,
            km_asset: body.km_asset,
            labor_cost: laborCost,
            record_number: "MTC-001",
            repair_notes: body.repair_plan,
            spareparts_cost: sparepartCost,
            total_cost: totalCost,
            asset_id: body.asset_id,
            driver_id: driver?.id ?? null,
            user_id: decoded.id,
          },
        });

        // Hubungkan spareparts yang sudah ada
        await Promise.all(
          body.spareparts.map((sparepart) =>
            prisma.maintenenceSparepart.create({
              data: {
                maintenence_id: maintenence.id,
                sparepart_id: sparepart.id,
                total: sparepart.quantity,
              },
            })
          )
        );
        // await prisma.maintenenceSparepart.createMany({
        //   data: body.spareparts.map((sparepart) => ({
        //     maintenence_id: maintenence.id,
        //     sparepart_id: sparepart.id,
        //   })),
        // });

        await prisma.maintenenceImage.createMany({
          data: createImages.map((img) => ({
            maintenence_id: maintenence.id,
            image_id: img.id,
          })),
        });

        const getMaintenence = await prisma.maintenence.findUnique({
          where: {
            id: maintenence.id,
          },
          include: {
            images: {
              include: {
                image: true,
              },
            },
            asset: {
              include: {
                chassis: true,
                equipment: true,
                vehicle: true,
              },
            },
            driver: true,
            spareparts: {
              include: {
                sparepart: true,
              },
            },
            user: true,
          },
        });

        // transform data agar images tidak berisi pivot
        const result = {
          ...getMaintenence,
          images: getMaintenence?.images.map((pivot) => pivot.image) ?? [],
          // spareparts:
          //   getMaintenence?.spareparts.map((pivot) => pivot.sparepart) ?? [],
        };

        return res.status(201).json(success(result));
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
