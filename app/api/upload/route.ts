/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import { uploadToS3 } from "@/app/services/s3-amazon";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { NextResponse } from "next/server";

export async function parseFormDataFromRequest(req: Request): Promise<{
  buffers: Buffer[];
  mimetypes: string[];
  originalFilenames: string[];
}> {
  const formData = await req.formData();

  const files = formData.getAll("files"); // Giả sử "files" là tên trường chứa tệp
  const buffers: Buffer[] = [];
  const mimetypes: string[] = [];
  const originalFilenames: string[] = [];
  if (!files || files.length === 0) {
    throw new Error("Không có tệp nào được gửi trong form data.");
  }

  for (const file of files as File[]) {
    // Kiểm tra nếu file là hợp lệ
    if (!(file instanceof File)) {
      console.error("Dữ liệu không phải là một file hợp lệ:", file);
      continue;
    }
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer) {
      console.error("Không thể lấy ArrayBuffer từ file:", file.name);
      continue;
    }
    buffers.push(Buffer.from(arrayBuffer)); // Chuyển ArrayBuffer thành Buffer
    mimetypes.push(file.type || "application/octet-stream");
    originalFilenames.push(file.name || "file");
  }

  // Kiểm tra nếu không có dữ liệu hợp lệ
  if (buffers.length === 0) {
    throw new Error("Không có tệp hợp lệ để xử lý.");
  }

  return { buffers, mimetypes, originalFilenames };
}
export async function POST(req: Request, res: Response) {
  try {
    // Kiểm tra người dùng có quyền không
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Bạn không có quyền truy cập", { status: 403 });
    }

    // Phân tích tệp tải lên từ form

    const { buffers, mimetypes, originalFilenames } =
      await parseFormDataFromRequest(req);

    const imageUrl = await uploadToS3({
      buffers,
      mimetypes,
      originalFilenames,
    });

    // Trả về URL của hình ảnh đã tải lên
    return NextResponse.json({ imageUrl: imageUrl }, { status: 200 });

    // Trả về URL của hình ảnh đã tải lên
  } catch (err) {
    console.error("[UPLOAD_IMAGE_API]", err);
    return new NextResponse("Lỗi gì đó ", { status: 500 });
  }
}

// Cấu hình API để tắt bodyParser mặc định của Next.js, sử dụng formidable
export const config = {
  api: {
    bodyParser: false, // Tắt body-parser mặc định vì sử dụng formidable
  },
};
