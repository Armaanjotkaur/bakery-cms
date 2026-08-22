"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MediaPicker from "@/components/admin/MediaPicker";

export default function PostForm({ initialPost }) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title || "");
  const [status, setStatus] = useState(initialPost?.status || "draft");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialPost?.content || "",
    immediatelyRender: false,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const content = editor?.getHTML() || "";
    if (!title.trim() || !content || content === "<p></p>") {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content,
        coverImage: coverImage?._id || null,
        status,
      };
      const url = isEdit ? `/api/posts/${initialPost._id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Save failed");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </label>

      <div className="mb-4">
        <span className="block text-sm font-medium mb-1">Cover image</span>
        {coverImage ? (
          <div className="flex items-center gap-3">
            <img src={coverImage.url} alt="" className="w-20 h-20 object-cover rounded-md border border-gray-200" />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
            >
              Change
            </button>
            <button type="button" onClick={() => setCoverImage(null)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50"
          >
            Choose image
          </button>
        )}
      </div>

      <div className="mb-4">
        <span className="block text-sm font-medium mb-1">Content</span>
        <div className="border border-gray-300 rounded-md">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} className="prose max-w-none p-3 min-h-[240px] focus:outline-none" />
        </div>
      </div>

      <label className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium">Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create post"}
      </button>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setCoverImage} />
    </form>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;
  const btn = "px-2 py-1 text-sm rounded hover:bg-gray-100";
  const active = "bg-gray-200";
  return (
    <div className="flex gap-1 border-b border-gray-200 p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btn} ${editor.isActive("bold") ? active : ""}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btn} ${editor.isActive("italic") ? active : ""}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
      >
        Quote
      </button>
    </div>
  );
}
