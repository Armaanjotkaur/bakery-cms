import { dbConnect } from "@/lib/db";
import Page from "@/models/Page";

export const metadata = {
  title: "About",
  description: "Learn more about Sweet Crumb Bakery.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await dbConnect();
  const page = await Page.findOne({ slug: "about", status: "published" }).populate("sections.image").lean();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-stone-900">About Us</h1>
      {!page && (
        <p className="text-stone-500">
          Content coming soon. Publish a Page with slug &quot;about&quot; in the admin panel to show it here.
        </p>
      )}
      {page?.sections?.map((section, i) => (
        <section key={i} className="mb-10">
          {section.heading && <h2 className="text-xl font-semibold mb-2 text-rose-700">{section.heading}</h2>}
          {section.image?.url && (
            <img src={section.image.url} alt={section.heading || ""} className="w-full rounded-lg mb-4" />
          )}
          {section.body && <p className="text-stone-700 whitespace-pre-line">{section.body}</p>}
        </section>
      ))}
    </div>
  );
}
