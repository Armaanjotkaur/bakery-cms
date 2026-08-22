import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-rose-50/30">
      <nav className="bg-white border-b border-rose-100 px-6 py-3 flex gap-6">
        <Link href="/admin" className="font-semibold text-rose-700">
          Bakery CMS
        </Link>
        <Link href="/admin/media" className="text-stone-600 hover:text-rose-600">
          Media Library
        </Link>
        <Link href="/admin/posts" className="text-stone-600 hover:text-rose-600">
          Posts
        </Link>
        <Link href="/admin/services" className="text-stone-600 hover:text-rose-600">
          Services
        </Link>
        <Link href="/admin/pages" className="text-stone-600 hover:text-rose-600">
          Pages
        </Link>
        <Link href="/admin/categories" className="text-stone-600 hover:text-rose-600">
          Categories
        </Link>
        <Link href="/admin/submissions" className="text-stone-600 hover:text-rose-600">
          Submissions
        </Link>
      </nav>
      {children}
    </div>
  );
}
