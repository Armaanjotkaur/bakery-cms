import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Post from "@/models/Post";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  await dbConnect();

  const post = await Post.findById(id).populate("coverImage").lean();
  if (!post) notFound();

  const initialPost = JSON.parse(JSON.stringify(post));

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-stone-900">Edit Post</h1>
      <PostForm initialPost={initialPost} />
    </main>
  );
}
