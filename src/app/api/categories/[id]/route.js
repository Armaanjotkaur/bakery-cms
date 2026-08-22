import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import Category from "@/models/Category";

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { name, type } = await request.json();
  if (!name || !type) {
    return NextResponse.json({ success: false, error: "name and type are required" }, { status: 400 });
  }

  await dbConnect();
  const slug = await generateUniqueSlug(Category, name, id);
  const category = await Category.findByIdAndUpdate(id, { name, slug, type }, { new: true });
  if (!category) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: category });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
