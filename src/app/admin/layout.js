import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6">
        <Link href="/admin" className="font-semibold">
          Bakery CMS
        </Link>
        <Link href="/admin/media" className="text-gray-600 hover:text-black">
          Media Library
        </Link>
      </nav>
      {children}
    </div>
  );
}
