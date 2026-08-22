"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";

function emptySection() {
  return { heading: "", body: "", image: null };
}

export default function PageForm({ initialPage }) {
  const router = useRouter();
  const isEdit = Boolean(initialPage);

  const [title, setTitle] = useState(initialPage?.title || "");
  const [status, setStatus] = useState(initialPage?.status || "draft");
  const [sections, setSections] = useState(
    initialPage?.sections?.length ? initialPage.sections : [emptySection()]
  );
  const [pickerIndex, setPickerIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateSection(index, patch) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(index) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        sections: sections.map((s) => ({
          heading: s.heading || "",
          body: s.body || "",
          image: s.image?._id || null,
        })),
        status,
      };
      const url = isEdit ? `/api/pages/${initialPage._id}` : "/api/pages";
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
      router.push("/admin/pages");
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
        <span className="block text-sm font-medium mb-1 text-stone-700">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-rose-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </label>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">Sections</span>
          <button
            type="button"
            onClick={addSection}
            className="text-sm border border-rose-200 text-stone-700 rounded px-3 py-1 hover:bg-rose-50"
          >
            + Add section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="border border-rose-100 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-stone-500">Section {index + 1}</span>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Heading"
                value={section.heading || ""}
                onChange={(e) => updateSection(index, { heading: e.target.value })}
                className="w-full border border-rose-200 rounded-md px-3 py-2 mb-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <textarea
                placeholder="Body"
                value={section.body || ""}
                onChange={(e) => updateSection(index, { body: e.target.value })}
                rows={3}
                className="w-full border border-rose-200 rounded-md px-3 py-2 mb-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />

              {section.image ? (
                <div className="flex items-center gap-3">
                  <img
                    src={section.image.url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-md border border-rose-100"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerIndex(index)}
                    className="text-sm border border-rose-200 text-stone-700 rounded px-3 py-1.5 hover:bg-rose-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSection(index, { image: null })}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickerIndex(index)}
                  className="text-sm border border-rose-200 text-stone-700 rounded px-3 py-1.5 hover:bg-rose-50"
                >
                  Choose image
                </button>
              )}
            </div>
          ))}
        </div>
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
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create page"}
      </button>

      <MediaPicker
        open={pickerIndex !== null}
        onClose={() => setPickerIndex(null)}
        onSelect={(media) => updateSection(pickerIndex, { image: media })}
      />
    </form>
  );
}
