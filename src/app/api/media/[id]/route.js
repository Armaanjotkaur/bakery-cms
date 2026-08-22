import crypto from "crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import cloudinary, { uploadBuffer } from "@/lib/cloudinary";
import { validateUploadedFile } from "@/lib/media";
import Media from "@/models/Media";

// Category-only update: lets an already-uploaded file be filed into a
// category without re-uploading (e.g. fixing files that predate a category).
export async function PATCH(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { category } = await request.json();

  await dbConnect();

  const media = await Media.findByIdAndUpdate(id, { category: category || undefined }, { new: true }).populate(
    "category"
  );
  if (!media) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: media });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const media = await Media.findById(id);
  if (!media) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  await cloudinary.uploader.destroy(media.publicId, { resource_type: media.resourceType });
  await media.deleteOne();

  return NextResponse.json({ success: true });
}

// Replace: uploads the new file, swaps the Cloudinary asset, and updates the
// same Media doc in place so anything referencing this _id keeps working.
export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const media = await Media.findById(id);
  if (!media) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  const validation = validateUploadedFile(file);
  if (validation.error) {
    return NextResponse.json({ success: false, error: validation.error }, { status: validation.status });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  const result = await uploadBuffer(buffer, {
    resource_type: "auto",
    folder: "bakery-cms",
  });

  const oldPublicId = media.publicId;
  const oldResourceType = media.resourceType;

  media.fileName = file.name;
  media.fileType = validation.fileType;
  media.mimeType = file.type;
  media.size = file.size;
  media.url = result.secure_url;
  media.publicId = result.public_id;
  media.resourceType = result.resource_type;
  media.hash = hash;
  await media.save();

  await cloudinary.uploader.destroy(oldPublicId, { resource_type: oldResourceType });

  return NextResponse.json({ success: true, data: media });
}
