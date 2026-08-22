"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";

export default function ServiceForm({ initialService }) {
  const router = useRouter();
  const isEdit = Boolean(initialService);

  const [title, setTitle] = useState(initialService?.title || "");
  const [description, setDescription] = useState(initialService?.description || "");
  const [price, setPrice] = useState(initialService?.price ?? "");
  const [status, setStatus] = useState(initialService?.status || "draft");
  const [image, setImage] = useState(initialService?.image || null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || price === "") {
      setError("Title, description and price are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price,
        image: image?._id || null,
        status,
      };
      const url = isEdit ? `/api/services/${initialService._id}` : "/api/services";
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
      router.push("/admin/services");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1 text-stone-700">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-rose-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1 text-stone-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-rose-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1 text-stone-700">Price</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-rose-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </label>

      <div className="mb-4">
        <span className="block text-sm font-medium mb-1 text-stone-700">Image</span>
        {image ? (
          <div className="flex items-center gap-3">
            <img src={image.url} alt="" className="w-20 h-20 object-cover rounded-md border border-rose-100" />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-sm border border-rose-200 text-stone-700 rounded px-3 py-1.5 hover:bg-rose-50"
            >
              Change
            </button>
            <button type="button" onClick={() => setImage(null)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="text-sm border border-rose-200 text-stone-700 rounded px-3 py-1.5 hover:bg-rose-50"
          >
            Choose image
          </button>
        )}
      </div>

      <label className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-stone-700">Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-rose-200 rounded-md px-3 py-1.5 text-stone-900">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-rose-600 text-white px-5 py-2 rounded-md hover:bg-rose-700 transition disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create service"}
      </button>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setImage} />
    </form>
  );
}
