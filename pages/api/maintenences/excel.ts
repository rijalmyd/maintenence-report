import { verifyToken } from "@/lib/auth";
import ExcelJS from "exceljs";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = [
        { id: 1, name: "Ahmad Rifai", role: "Software Engineer" },
        { id: 2, name: "Budi Santoso", role: "Barista" },
        { id: 3, name: "Citra Dewi", role: "Photographer" },
      ];

      // Membuat workbook dan worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report Maintenence");

      // Tambahkan header
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 30 },
        { header: "Role", key: "role", width: 30 },
      ];

      // Tambah data
      data.forEach((item) => {
        worksheet.addRow(item);
      });

      // Styling header
      worksheet.getRow(1).font = { bold: true };

      // Simpan ke buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set header agar browser download file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal membuat file Excel" });
    }
  }
}

export default verifyToken(handler);
