import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Media from "@/models/Media";

export const metadata = {
  title: "Downloads",
  description: "Download our menu, brochures, and other documents.",
};

export const dynamic = "force-dynamic";

function humanFileSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default async function DownloadsPage() {
  await dbConnect();
  const categories = await Category.find({ slug: { $in: ["brochures", "reports"] }, type: "media" }).lean();
  const categoryIds = categories.map((c) => c._id);
  const items = categoryIds.length
    ? await Media.find({ category: { $in: categoryIds } }).sort({ createdAt: -1 }).lean()
    : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Downloads</h1>
      {items.length === 0 && (
        <p className="text-gray-500">
          No downloads yet. Add files to a &quot;Brochures&quot; or &quot;Reports&quot; category in the admin panel.
        </p>
      )}
      <ul className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg">
        {items.map((item) => (
          <li key={String(item._id)} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{item.fileName}</p>
              <p className="text-xs text-gray-500">{humanFileSize(item.size)}</p>
            </div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-black underline">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
