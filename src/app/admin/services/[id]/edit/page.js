import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Service from "@/models/Service";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function EditServicePage({ params }) {
  const { id } = await params;
  await dbConnect();

  const service = await Service.findById(id).populate("image").lean();
  if (!service) notFound();

  const initialService = JSON.parse(JSON.stringify(service));

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Service</h1>
      <ServiceForm initialService={initialService} />
    </main>
  );
}
