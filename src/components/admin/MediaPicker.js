"use client";

import { useEffect, useState } from "react";

export default function MediaPicker({ open, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const params = new URLSearchParams({ limit: "40", type: "image" });
    if (search) params.set("search", search);
    fetch(`/api/media?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setItems(json.data);
      })
      .finally(() => setLoading(false));
  }, [open, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Choose image</h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3">
          {loading && <p className="text-gray-500 col-span-full text-center py-8">Loading...</p>}
          {!loading && items.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">No images found. Upload some in the Media Library first.</p>
          )}
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="border border-gray-200 rounded-md overflow-hidden hover:ring-2 hover:ring-black transition"
            >
              <img src={item.url} alt={item.fileName} className="w-full aspect-square object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
