import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" }).lean();
  if (!post) return {};

  return {
    title: post.title,
    description: post.content.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" }).populate("coverImage").lean();
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2 text-stone-900">{post.title}</h1>
      <p className="text-sm text-stone-500 mb-6">{new Date(post.publishedAt).toLocaleDateString()}</p>
      {post.coverImage?.url && (
        <img src={post.coverImage.url} alt={post.title} className="w-full rounded-lg mb-8" />
      )}
      {/* Content is authored by the admin via the CMS editor, not public input.
          In a larger app this would still be sanitized (e.g. DOMPurify) before render. */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
