import { dbConnect } from "@/lib/db";
import Service from "@/models/Service";

export const metadata = {
  title: "Menu",
  description: "Browse our fresh-baked menu of breads, pastries, and cakes.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  await dbConnect();
  const services = await Service.find({ status: "published" }).populate("image").sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-stone-900">Our Menu</h1>
      {services.length === 0 && <p className="text-stone-500">No items available yet.</p>}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={String(service._id)} className="bg-white border border-rose-100 rounded-lg overflow-hidden shadow-sm">
            {service.image?.url && (
              <img src={service.image.url} alt={service.title} className="w-full aspect-square object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-medium text-stone-900">{service.title}</h2>
                <span className="text-rose-700 font-semibold">${service.price.toFixed(2)}</span>
              </div>
              <p className="text-stone-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
