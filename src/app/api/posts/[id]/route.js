import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import { generateUniqueSlug } from "@/lib/uniqueSlug";
import { trackUsedIn, untrackUsedIn } from "@/lib/usedIn";
import Post from "@/models/Post";

export async function GET(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const post = await Post.findById(id).populate("coverImage");
  if (!post) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: post });
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const { title, content, coverImage, status } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ success: false, error: "title and content are required" }, { status: 400 });
  }

  await dbConnect();

  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const oldCoverImage = post.coverImage ? String(post.coverImage) : null;
  const newCoverImage = coverImage || null;

  if (title !== post.title) {
    post.slug = await generateUniqueSlug(Post, title, post._id);
  }
  post.title = title;
  post.content = content;
  post.coverImage = newCoverImage || undefined;

  const wasPublished = post.status === "published";
  const finalStatus = status === "published" ? "published" : "draft";
  post.status = finalStatus;
  if (finalStatus === "published" && !wasPublished) {
    post.publishedAt = new Date();
  }

  await post.save();

  if (oldCoverImage !== newCoverImage) {
    await untrackUsedIn(oldCoverImage, "Post", post._id);
    await trackUsedIn(newCoverImage, "Post", post._id);
  }

  return NextResponse.json({ success: true, data: post });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  await untrackUsedIn(post.coverImage, "Post", post._id);

  return NextResponse.json({ success: true });
}
