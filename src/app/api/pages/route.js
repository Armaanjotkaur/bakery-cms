import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import { trackUsedIn } from "@/lib/usedIn";
import Page from "@/models/Page";

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  await dbConnect();

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const query = status ? { status } : {};

  const pages = await Page.find(query).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: pages });
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { title, sections, status } = await request.json();
  if (!title) {
    return NextResponse.json({ success: false, error: "title is required" }, { status: 400 });
  }

  await dbConnect();

  const slug = await generateUniqueSlug(Page, title);
  const finalSections = Array.isArray(sections) ? sections : [];

  const page = await Page.create({
    title,
    slug,
    sections: finalSections,
    status: status === "published" ? "published" : "draft",
  });

  for (const section of finalSections) {
    if (section.image) await trackUsedIn(section.image, "Page", page._id);
  }

  return NextResponse.json({ success: true, data: page }, { status: 201 });
}
