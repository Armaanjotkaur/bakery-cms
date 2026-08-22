import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Post from "@/models/Post";
import Service from "@/models/Service";
import Media from "@/models/Media";
import Submission from "@/models/Submission";

export default async function AdminHome() {
  const session = await getSession();
  await dbConnect();

  const [postCount, serviceCount, mediaCount, unreadCount, recentMedia, recentSubmissions] = await Promise.all([
    Post.countDocuments(),
    Service.countDocuments(),
    Media.countDocuments(),
    Submission.countDocuments({ isRead: false }),
    Media.find().sort({ createdAt: -1 }).limit(5).lean(),
    Submission.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const stats = [
    { label: "Posts", value: postCount, href: "/admin/posts" },
    { label: "Services", value: serviceCount, href: "/admin/services" },
    { label: "Media files", value: mediaCount, href: "/admin/media" },
    { label: "Unread submissions", value: unreadCount, href: "/admin/submissions" },
  ];

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Signed in as {session.email}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Log out
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
          >
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent uploads</h2>
          <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {recentMedia.map((m) => (
              <li key={String(m._id)} className="flex items-center gap-3 p-3">
                {m.fileType === "image" ? (
                  <img src={m.url} alt={m.fileName} className="w-10 h-10 object-cover rounded-md" />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md text-lg">
                    📄
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm truncate">{m.fileName}</p>
                  <p className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
            {recentMedia.length === 0 && <li className="p-3 text-sm text-gray-500">No uploads yet.</li>}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Recent submissions</h2>
          <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {recentSubmissions.map((s) => (
              <li key={String(s._id)} className="p-3">
                <p className={`text-sm ${!s.isRead ? "font-semibold" : ""}`}>{s.name}</p>
                <p className="text-xs text-gray-500 truncate">{s.message}</p>
              </li>
            ))}
            {recentSubmissions.length === 0 && <li className="p-3 text-sm text-gray-500">No submissions yet.</li>}
          </ul>
        </div>
      </div>
    </main>
  );
}
