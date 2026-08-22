import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import Category from "@/models/Category";

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  await dbConnect();
  const type = request.nextUrl.searchParams.get("type");
  const query = type ? { type } : {};
  const categories = await Category.find(query).sort({ name: 1 });

  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { name, type } = await request.json();
  if (!name || !type) {
    return NextResponse.json({ success: false, error: "name and type are required" }, { status: 400 });
  }

  await dbConnect();
  const slug = await generateUniqueSlug(Category, name);
  const category = await Category.create({ name, slug, type });

  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
