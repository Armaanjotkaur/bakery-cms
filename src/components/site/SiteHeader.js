import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Sweet Crumb Bakery
        </Link>
        <div className="flex gap-5 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-black">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
