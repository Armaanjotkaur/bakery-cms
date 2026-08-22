import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-stone-500">
        <p>&copy; {new Date().getFullYear()} Sweet Crumb Bakery</p>
        <Link href="/login" className="hover:text-rose-600">
          Staff login
        </Link>
      </div>
    </footer>
  );
}
