import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Media from "@/models/Media";

export const metadata = {
  title: "Gallery",
  description: "Photos from Sweet Crumb Bakery.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await dbConnect();
  const category = await Category.findOne({ slug: "gallery", type: "media" }).lean();
  const items = category
    ? await Media.find({ category: category._id, fileType: "image" }).sort({ createdAt: -1 }).lean()
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Gallery</h1>
      {items.length === 0 && (
        <p className="text-gray-500">
          No photos yet. Add images to a &quot;Gallery&quot; category in the admin panel to show them here.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <img
            key={String(item._id)}
            src={item.url}
            alt={item.fileName}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
