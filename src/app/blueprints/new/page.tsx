"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic_import from "next/dynamic";
import pb from "@/lib/pb";
import { COMPOSITION_META } from "../../../../remotion/meta";

const RemotionPreview = dynamic_import(() =>
  import("@/components/RemotionPreview").then((m) => ({ default: m.RemotionPreview })),
  { ssr: false }
);

const COMPOSITIONS = Object.keys(COMPOSITION_META);

export default function NewBlueprintPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [compositionId, setCompositionId] = useState(COMPOSITIONS[0] || "TextCard");
  const [params, setParams] = useState<Record<string, unknown>>(
    COMPOSITION_META[COMPOSITIONS[0]]?.defaultProps || {}
  );
  const [saving, setSaving] = useState(false);

  function handleParamChange(key: string, value: string) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (!name.trim()) return alert("Name eingeben");
    setSaving(true);
    try {
      await pb.collection("blueprints").create({ name, composition_id: compositionId, params });
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Neuer Blueprint</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mein Blueprint"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Komposition</label>
              <select
                value={compositionId}
                onChange={(e) => {
                  setCompositionId(e.target.value);
                  setParams(COMPOSITION_META[e.target.value]?.defaultProps || {});
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
              >
                {COMPOSITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm text-gray-400">Parameter</h3>
              {Object.entries(params).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{key}</label>
                  <input
                    value={String(value)}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                {saving ? "Speichert…" : "Blueprint speichern"}
              </button>
              <button onClick={() => router.back()} className="text-gray-400 hover:text-white px-4 py-2.5 transition-colors">
                Abbrechen
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-3">Vorschau</p>
            <RemotionPreview compositionId={compositionId} inputProps={params} />
          </div>
        </div>
      </div>
    </main>
  );
}
