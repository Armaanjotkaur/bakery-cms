import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Service from "@/models/Service";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ServicesListPage() {
  await dbConnect();
  const services = await Service.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Menu / Services</h1>
        <Link href="/admin/services/new" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          New service
        </Link>
      </div>

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={String(service._id)} className="border-t border-gray-100">
              <td className="p-3">{service.title}</td>
              <td className="p-3">${service.price.toFixed(2)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    service.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/services/${service._id}/edit`}
                    className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton url={`/api/services/${service._id}`} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {services.length === 0 && <p className="text-gray-500 text-center py-8">No services yet.</p>}
    </main>
  );
}
