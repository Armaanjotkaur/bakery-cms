import crypto from "crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { uploadBuffer } from "@/lib/cloudinary";
import { validateUploadedFile } from "@/lib/media";
import Media from "@/models/Media";

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");
  const categoryId = formData.get("category");

  const validation = validateUploadedFile(file);
  if (validation.error) {
    return NextResponse.json({ success: false, error: validation.error }, { status: validation.status });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  await dbConnect();

  const existing = await Media.findOne({ hash });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "This file has already been uploaded", data: existing },
      { status: 409 }
    );
  }

  const result = await uploadBuffer(buffer, {
    resource_type: "auto",
    folder: "bakery-cms",
  });

  const media = await Media.create({
    fileName: file.name,
    fileType: validation.fileType,
    mimeType: file.type,
    size: file.size,
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    hash,
    category: categoryId || undefined,
  });

  return NextResponse.json({ success: true, data: media }, { status: 201 });
}

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  await dbConnect();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "date";

  const query = {};
  if (type) query.fileType = type;
  if (category) query.category = category;
  if (search) query.fileName = { $regex: search, $options: "i" };

  const sortMap = {
    date: { createdAt: -1 },
    name: { fileName: 1 },
    size: { size: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.date;

  const [items, total] = await Promise.all([
    Media.find(query)
      .populate("category")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit),
    Media.countDocuments(query),
  ]);

  return NextResponse.json({
    success: true,
    data: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}
