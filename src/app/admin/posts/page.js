import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Post from "@/models/Post";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function PostsListPage() {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Posts</h1>
        <Link href="/admin/posts/new" className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition">
          New post
        </Link>
      </div>

      <table className="w-full text-sm border border-rose-100 rounded-lg overflow-hidden">
        <thead className="bg-rose-50/60 text-left text-stone-700">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={String(post._id)} className="border-t border-rose-50">
              <td className="p-3 text-stone-900">{post.title}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="p-3 text-stone-500">{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/posts/${post._id}/edit`}
                    className="text-xs border border-rose-200 text-stone-700 rounded px-2 py-1 hover:bg-rose-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton url={`/api/posts/${post._id}`} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {posts.length === 0 && <p className="text-stone-500 text-center py-8">No posts yet.</p>}
    </main>
  );
}
