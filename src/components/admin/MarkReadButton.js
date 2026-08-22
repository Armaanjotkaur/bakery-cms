"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ id, isRead }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch(`/api/submissions/${id}`, { method: "PATCH" });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      router.refresh();
    } else {
      alert(json.error || "Update failed");
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className="text-xs border border-rose-200 text-stone-700 rounded px-2 py-1 hover:bg-rose-50 disabled:opacity-50"
    >
      {loading ? "..." : isRead ? "Mark unread" : "Mark read"}
    </button>
  );
}
