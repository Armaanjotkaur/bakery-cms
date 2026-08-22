import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <div className="flex flex-col flex-1 bg-rose-50/40">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
