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
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/admin/posts/new" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          New post
        </Link>
      </div>

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={String(post._id)} className="border-t border-gray-100">
              <td className="p-3">{post.title}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    post.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {post.status}
                </span>
              </td>
              <td className="p-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/posts/${post._id}/edit`}
                    className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50"
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

      {posts.length === 0 && <p className="text-gray-500 text-center py-8">No posts yet.</p>}
    </main>
  );
}
