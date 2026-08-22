import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/api";
import Submission from "@/models/Submission";

export async function PATCH(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const submission = await Submission.findById(id);
  if (!submission) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  submission.isRead = !submission.isRead;
  await submission.save();

  return NextResponse.json({ success: true, data: submission });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await dbConnect();

  const submission = await Submission.findByIdAndDelete(id);
  if (!submission) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
