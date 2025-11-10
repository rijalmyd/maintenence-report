import { fail, success } from "@/lib/apiResponse";
import prisma from "@/lib/prisma";
import { LoginUserSchema } from "@/schema/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // validate request
    const body = LoginUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) return res.status(401).json(fail("invalid credential"));

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) return res.status(401).json(fail("invalid credential"));

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string
      // { expiresIn: "1d" }
    );

    return res.status(200).json(
      success(
        {
          user,
          token,
        },
        "user login successfully"
      )
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.flatten().fieldErrors,
      });
    }
    return res.status(500).json(fail("terjadi kesalahan server"));
  }
}
