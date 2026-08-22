import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Post from "@/models/Post";

export const metadata = {
  title: "Home",
  description: "Fresh-baked bread, pastries, and cakes made daily at Sweet Crumb Bakery.",
};

// Content is edited live via the CMS, so this page must read the DB on every
// request rather than being baked into a static build.
export const dynamic = "force-dynamic";

const HIGHLIGHTS = [
  { title: "Baked fresh daily", body: "Every loaf and pastry is made from scratch each morning." },
  { title: "Locally sourced", body: "We use flour, butter, and fruit from nearby farms." },
  { title: "Custom cakes", body: "Order a custom cake for your next celebration." },
];

export default async function HomePage() {
  await dbConnect();
  const posts = await Post.find({ status: "published" })
    .populate("coverImage")
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold mb-4">Sweet Crumb Bakery</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Handmade bread, pastries, and cakes baked fresh every morning.
        </p>
        <Link href="/menu" className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
          View our menu
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-6">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">{h.title}</h2>
            <p className="text-gray-600 text-sm">{h.body}</p>
          </div>
        ))}
      </section>

      {posts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold mb-6">From the blog</h2>
          <div className="grid sm:grid-cols-3 gap-6">
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
                  <h3 className="font-medium">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
