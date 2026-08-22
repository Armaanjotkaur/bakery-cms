"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function humanFileSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

const PAGE_SIZE = 20;

export default function MediaLibraryPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date");
  const [uploadCategory, setUploadCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceTargetId = useRef(null);

  const loadMedia = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE), sort });
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (category) params.set("category", category);

    const res = await fetch(`/api/media?${params}`);
    const json = await res.json();
    if (json.success) {
      setItems(json.data);
      setPagination(json.pagination);
    }
  }, [page, sort, search, type, category]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    fetch("/api/categories?type=media")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      });
  }, []);

  async function uploadFile(file) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (uploadCategory) formData.append("category", uploadCategory);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Upload failed");
      } else {
        setPage(1);
        await loadMedia();
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  async function handleDelete(id) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      loadMedia();
    } else {
      alert(json.error || "Delete failed");
    }
  }

  function openReplace(id) {
    replaceTargetId.current = id;
    replaceInputRef.current?.click();
  }

  async function handleSetCategory(id, categoryId) {
    const res = await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: categoryId || null }),
    });
    const json = await res.json();
    if (json.success) {
      loadMedia();
    } else {
      alert(json.error || "Update failed");
    }
  }

  async function handleReplaceSelect(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !replaceTargetId.current) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/media/${replaceTargetId.current}`, {
      method: "PUT",
      body: formData,
    });
    const json = await res.json();
    if (json.success) {
      loadMedia();
    } else {
      alert(json.error || "Replace failed");
    }
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-stone-900">Media Library</h1>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center mb-6 transition ${
          isDragging ? "border-rose-500 bg-rose-50" : "border-rose-200"
        }`}
      >
        <p className="text-stone-600 mb-2">
          {uploading ? "Uploading..." : "Drag and drop a file here, or"}
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition disabled:opacity-50"
        >
          Browse files
        </button>
        <p className="text-stone-400 text-xs mt-2">JPG, PNG, WEBP, PDF, DOC, DOCX — up to 5 MB</p>

        <label className="inline-flex items-center gap-2 mt-4 text-sm text-stone-600">
          Upload to category:
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="border border-rose-200 rounded-md px-2 py-1 text-stone-900"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx"
        />
        <input ref={replaceInputRef} type="file" className="hidden" onChange={handleReplaceSelect} />
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by file name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-rose-200 rounded-md px-3 py-2 flex-1 min-w-[200px] text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="border border-rose-200 rounded-md px-3 py-2 text-stone-900"
        >
          <option value="">All types</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
        </select>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border border-rose-200 rounded-md px-3 py-2 text-stone-900"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-rose-200 rounded-md px-3 py-2 text-stone-900">
          <option value="date">Newest first</option>
          <option value="name">Name</option>
          <option value="size">Largest first</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {items.map((item) => (
          <div key={item._id} className="border border-rose-100 rounded-lg overflow-hidden bg-white">
            <div className="aspect-square bg-rose-50 flex items-center justify-center">
              {item.fileType === "image" ? (
                <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-4xl">
                  📄
                </a>
              )}
            </div>
            <div className="p-3 text-sm">
              <p className="font-medium truncate text-stone-900" title={item.fileName}>
                {item.fileName}
              </p>
              <p className="text-stone-500">
                {humanFileSize(item.size)} · {item.fileType}
              </p>
              <p className="text-stone-500">{new Date(item.createdAt).toLocaleDateString()}</p>
              <select
                value={item.category?._id || ""}
                onChange={(e) => handleSetCategory(item._id, e.target.value)}
                className="w-full border border-rose-200 rounded px-1.5 py-1 text-xs text-stone-700 mt-1"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {item.usedIn?.length > 0 && (
                <p className="text-stone-400 text-xs">Used in {item.usedIn.length} place(s)</p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openReplace(item._id)}
                  className="text-xs border border-rose-200 text-stone-700 rounded px-2 py-1 hover:bg-rose-50"
                >
                  Replace
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-xs border border-red-300 text-red-600 rounded px-2 py-1 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="text-stone-500 text-center py-8">No media yet.</p>}

      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="border border-rose-200 text-stone-700 rounded-md px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-stone-600">
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="border border-rose-200 text-stone-700 rounded-md px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
