"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RenderButton({ blueprintId }: { blueprintId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRender() {
    setLoading(true);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/history");
      } else {
        alert("Render fehlgeschlagen: " + data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRender}
      disabled={loading}
      className="text-sm bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors"
    >
      {loading ? "Rendert…" : "Rendern"}
    </button>
  );
}
