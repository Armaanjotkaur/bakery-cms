"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ url, confirmMessage = "Delete this item? This cannot be undone." }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      router.refresh();
    } else {
      alert(json.error || "Delete failed");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs border border-red-300 text-red-600 rounded px-2 py-1 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
