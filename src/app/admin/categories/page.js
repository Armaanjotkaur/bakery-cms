"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("media");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.success) setCategories(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.success) {
      setError(json.error || "Save failed");
      return;
    }
    setName("");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      load();
    } else {
      alert(json.error || "Delete failed");
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="media">Media</option>
          <option value="content">Content</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Type</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id} className="border-t border-gray-100">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-gray-500">{c.type}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-xs border border-red-300 text-red-600 rounded px-2 py-1 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && <p className="text-gray-500 text-center py-8">No categories yet.</p>}
    </main>
  );
}
