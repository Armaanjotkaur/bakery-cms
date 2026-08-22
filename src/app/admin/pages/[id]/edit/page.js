import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import PageModel from "@/models/Page";
import PageForm from "@/components/admin/PageForm";

export default async function EditPagePage({ params }) {
  const { id } = await params;
  await dbConnect();

  const page = await PageModel.findById(id).populate("sections.image").lean();
  if (!page) notFound();

  const initialPage = JSON.parse(JSON.stringify(page));

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Page</h1>
      <PageForm initialPage={initialPage} />
    </main>
  );
}
