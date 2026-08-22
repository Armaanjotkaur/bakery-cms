import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import { trackUsedIn, untrackUsedIn } from "@/lib/usedIn";
import Page from "@/models/Page";

export async function GET(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const page = await Page.findById(id).populate("sections.image");
  if (!page) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: page });
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { title, sections, status } = await request.json();
  if (!title) {
    return NextResponse.json({ success: false, error: "title is required" }, { status: 400 });
  }

  await dbConnect();

  const page = await Page.findById(id);
  if (!page) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const oldImageIds = new Set(page.sections.filter((s) => s.image).map((s) => String(s.image)));
  const finalSections = Array.isArray(sections) ? sections : [];
  const newImageIds = new Set(finalSections.filter((s) => s.image).map((s) => String(s.image)));

  if (title !== page.title) {
    page.slug = await generateUniqueSlug(Page, title, page._id);
  }
  page.title = title;
  page.sections = finalSections;
  page.status = status === "published" ? "published" : "draft";

  await page.save();

  for (const oldId of oldImageIds) {
    if (!newImageIds.has(oldId)) await untrackUsedIn(oldId, "Page", page._id);
  }
  for (const newId of newImageIds) {
    if (!oldImageIds.has(newId)) await trackUsedIn(newId, "Page", page._id);
  }

  return NextResponse.json({ success: true, data: page });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const page = await Page.findByIdAndDelete(id);
  if (!page) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  for (const section of page.sections) {
    if (section.image) await untrackUsedIn(section.image, "Page", page._id);
  }

  return NextResponse.json({ success: true });
}
