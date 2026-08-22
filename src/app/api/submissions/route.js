import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Submission from "@/models/Submission";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
