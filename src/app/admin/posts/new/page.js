import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-stone-900">New Post</h1>
      <PostForm />
    </main>
  );
}
