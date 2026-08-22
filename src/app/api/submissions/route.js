import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import Submission from "@/models/Submission";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  await dbConnect();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));

  const [items, total] = await Promise.all([
    Submission.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Submission.countDocuments(),
  ]);

  return NextResponse.json({
    success: true,
    data: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

export async function POST(request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "name, email and message are required" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid email address" }, { status: 400 });
  }

  await dbConnect();
  const submission = await Submission.create({ name, email, message });

  return NextResponse.json({ success: true, data: submission }, { status: 201 });
}
