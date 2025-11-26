/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, success } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const sparepartsRaw = await prisma.maintenenceSparepart.groupBy({
          by: ["sparepart_id"],
          _sum: { total: true },
          orderBy: { _sum: { total: "desc" } },
        });

        const result = await Promise.all(
          sparepartsRaw.map(async (item) => {
            const sparepart = await prisma.sparepart.findUnique({
              where: { id: item.sparepart_id },
            });

            return {
              sparepart_id: item.sparepart_id,
              name: sparepart?.name,
              unit: sparepart?.unit,
              price: sparepart?.price,
              total_used: item._sum.total,
            };
          })
        );

        return res.status(201).json(success(result));
      }
      default:
        return res.status(405).json(fail("Method not allowed"));
    }
  } catch (error: any) {
    console.error("API error:", error);
    return res
      .status(500)
      .json(fail("Terjadi kesalahan server", error.message));
  }
}
