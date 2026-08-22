import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Post from "@/models/Post";

export const metadata = {
  title: "Blog",
  description: "News and stories from Sweet Crumb Bakery.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || "1", 10));

  await dbConnect();
  const query = { status: "published" };
  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("coverImage")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Post.countDocuments(query),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Blog</h1>
      {posts.length === 0 && <p className="text-gray-500">No posts published yet.</p>}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => (
          <Link
            key={String(post._id)}
            href={`/blog/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            {post.coverImage?.url && (
              <img src={post.coverImage.url} alt={post.title} className="w-full aspect-video object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-medium mb-1">{post.title}</h2>
              <p className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            className={`border border-gray-300 rounded-md px-3 py-1 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            Prev
          </Link>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            className={`border border-gray-300 rounded-md px-3 py-1 ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
