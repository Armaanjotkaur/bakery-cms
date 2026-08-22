import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import Category from "@/models/Category";

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const type = request.nextUrl.searchParams.get("type");
  const query = type ? { type } : {};
  const categories = await Category.find(query).sort({ name: 1 });

  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { name, type } = await request.json();
  if (!name || !type) {
    return NextResponse.json({ success: false, error: "name and type are required" }, { status: 400 });
  }

  await dbConnect();
  const category = await Category.create({ name, slug: slugify(name), type });

  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
