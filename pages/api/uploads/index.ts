/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // ✅ UUID untuk nama file

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
    multiples: true,
    keepExtensions: true,
  });

  try {
    const data = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // ✅ Tentukan subpath dari request body
    const requestedPath = (
      data.fields.path?.[0] ||
      data.fields.path ||
      ""
    ).trim();
    const safeSubPath = requestedPath.replace(/^(\.\.[/\\])+/, ""); // Hindari path traversal
    const uploadDir = path.join(
      process.cwd(),
      "public",
      safeSubPath || "uploads"
    );

    // Pastikan direktori tujuan ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Simpan semua file dengan UUID filename
    const savedFiles: string[] = [];
    for (const [_, fileArray] of Object.entries(data.files)) {
      const files = Array.isArray(fileArray) ? fileArray : [fileArray];
      for (const file of files) {
        const ext = path.extname(file.originalFilename || "");
        const newFileName = `${uuidv4()}${ext}`;
        const newPath = path.join(uploadDir, newFileName);
        fs.renameSync(file.filepath, newPath);
        savedFiles.push(newPath);
      }
    }

    // ✅ Bangun URL file publik
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
    const fileUrls = savedFiles.map(
      (fullPath) =>
        `${baseUrl}/${fullPath
          .replace(`${process.cwd()}${path.sep}public${path.sep}`, "")
          .replace(/\\/g, "/")}`
    );

    // ✅ Response
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        path: safeSubPath || "uploads",
        file_urls: fileUrls.map((url) => url),
      },
    });
  } catch (error) {
    console.error("Error parsing form:", error);
    res.status(500).json({ error: "Failed to process form data" });
  }
}
