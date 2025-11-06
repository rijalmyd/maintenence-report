/* eslint-disable @typescript-eslint/no-explicit-any */
import { File, IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({
    multiples: false, // hanya 1 file
    keepExtensions: true,
  });

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // ✅ Tentukan folder upload (dari request.path)
    const requestedPath = (fields.path?.[0] || fields.path || "").trim();
    const safeSubPath = requestedPath.replace(/^(\.\.[/\\])+/, ""); // hindari path traversal
    const uploadDir = path.join(
      process.cwd(),
      "public",
      safeSubPath || "uploads"
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // ✅ Ambil file dari `files`
    const fileData = Array.isArray(files.file)
      ? files.file[0]
      : (files.file as File);

    if (!fileData || !fileData.filepath) {
      console.error("Formidable result:", files);
      return res.status(400).json({ error: "No valid file uploaded" });
    }

    // ✅ Ganti nama dengan UUID
    const ext = path.extname(fileData.originalFilename || "");
    const newFileName = `${uuidv4()}${ext}`;
    const newPath = path.join(uploadDir, newFileName);

    // ✅ Pindahkan file dari tmp ke folder publik
    fs.renameSync(fileData.filepath, newPath);

    // ✅ Bangun URL publik
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
    const fileUrl = `${baseUrl}/${newPath
      .replace(`${process.cwd()}${path.sep}public${path.sep}`, "")
      .replace(/\\/g, "/")}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        path: safeSubPath || "uploads",
        file_url: fileUrl,
        file_name: newFileName,
      },
    });
  } catch (error) {
    console.error("Error parsing form:", error);
    res.status(500).json({ error: "Failed to process form data" });
  }
}
