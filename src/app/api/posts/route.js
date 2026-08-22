import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import { trackUsedIn } from "@/lib/usedIn";
import Post from "@/models/Post";

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  await dbConnect();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const query = {};
  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: "i" };

  const [items, total] = await Promise.all([
    Post.find(query)
      .populate("coverImage")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(query),
  ]);

  return NextResponse.json({
    success: true,
    data: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { title, content, coverImage, status } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ success: false, error: "title and content are required" }, { status: 400 });
  }

  await dbConnect();

  const slug = await generateUniqueSlug(Post, title);
  const finalStatus = status === "published" ? "published" : "draft";

  const post = await Post.create({
    title,
    slug,
    content,
    coverImage: coverImage || undefined,
    status: finalStatus,
    publishedAt: finalStatus === "published" ? new Date() : undefined,
  });

  await trackUsedIn(coverImage, "Post", post._id);

  return NextResponse.json({ success: true, data: post }, { status: 201 });
}
