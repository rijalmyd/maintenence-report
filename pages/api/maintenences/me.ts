/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@/generated/prisma/client";
import { fail, success } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/pages/api-middleware/auth";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json(fail("unathorized"));

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      username: string;
    };

    const { page = 1, size = 10, search = "" } = req.query;

    const skip = (Number(page) - 1) * Number(size);
    const take = Number(size);

    const where: Prisma.MaintenenceWhereInput = search
      ? {
          AND: [{ user_id: decoded.id }],
          OR: [
            {
              record_number: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              complaint: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              repair_notes: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              asset: {
                name: { contains: search as string, mode: "insensitive" },
              },
            },
            {
              driver: {
                name: { contains: search as string, mode: "insensitive" },
              },
            },
          ],
        }
      : {};

    // Hitung total untuk pagination
    const total = await prisma.maintenence.count({ where });

    const maintenences = await prisma.maintenence.findMany({
      where,
      skip,
      take,
      include: {
        asset: true,
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
    });

    // transform data agar images tidak berisi pivot
    const formatted = maintenences.map((m) => ({
      ...m,
      images: m.images?.map((pivot) => pivot.image), // ambil langsung objek image-nya
      spareparts: m.spareparts?.map((pivot) => pivot.sparepart),
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
  } catch (error: any) {
    res.status(401).json(fail("invalid or expired token", error));
  }
}

export default verifyToken(handler);
