import Link from "next/link";
import pb from "@/lib/pb";
import type { RenderHistory } from "@/lib/pb";

async function getHistory(): Promise<RenderHistory[]> {
  try {
    const records = await pb.collection("render_history").getFullList({ sort: "-created" });
    return records as unknown as RenderHistory[];
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400",
  rendering: "text-blue-400",
  done: "text-green-400",
  error: "text-red-400",
};

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Render-Historie</h1>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Dashboard
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-xl p-16 text-center">
            <p className="text-gray-500">Noch keine Renders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Blueprint: {item.blueprint_id}</p>
                  <p className={`text-sm font-medium mt-0.5 ${STATUS_COLORS[item.status] || "text-gray-400"}`}>
                    {item.status.toUpperCase()}
                    {item.error_message && ` — ${item.error_message}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{new Date(item.created).toLocaleString("de-CH")}</p>
                </div>
                {item.status === "done" && item.output_file && (
                  <a
                    href={item.output_file}
                    download
                    className="bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Download MP4
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
