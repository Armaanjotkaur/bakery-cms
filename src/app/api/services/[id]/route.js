import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import { trackUsedIn, untrackUsedIn } from "@/lib/usedIn";
import Service from "@/models/Service";

export async function GET(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const service = await Service.findById(id).populate("image");
  if (!service) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: service });
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { title, description, price, image, status } = await request.json();
  if (!title || !description || price === undefined || price === null || price === "") {
    return NextResponse.json(
      { success: false, error: "title, description and price are required" },
      { status: 400 }
    );
  }
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return NextResponse.json({ success: false, error: "price must be a non-negative number" }, { status: 400 });
  }

  await dbConnect();

  const service = await Service.findById(id);
  if (!service) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const oldImage = service.image ? String(service.image) : null;
  const newImage = image || null;

  if (title !== service.title) {
    service.slug = await generateUniqueSlug(Service, title, service._id);
  }
  service.title = title;
  service.description = description;
  service.price = numericPrice;
  service.image = newImage || undefined;
  service.status = status === "published" ? "published" : "draft";

  await service.save();

  if (oldImage !== newImage) {
    await untrackUsedIn(oldImage, "Service", service._id);
    await trackUsedIn(newImage, "Service", service._id);
  }

  return NextResponse.json({ success: true, data: service });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const service = await Service.findByIdAndDelete(id);
  if (!service) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  await untrackUsedIn(service.image, "Service", service._id);

  return NextResponse.json({ success: true });
}
