import Link from "next/link";
import pb from "@/lib/pb";
import type { Blueprint } from "@/lib/pb";
import { RenderButton } from "@/components/RenderButton";

async function getBlueprints(): Promise<Blueprint[]> {
  try {
    const records = await pb.collection("blueprints").getFullList({ sort: "-created" });
    return records as unknown as Blueprint[];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const blueprints = await getBlueprints();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Video Factory</h1>
            <p className="text-gray-400 mt-1">Blueprints erstellen, rendern, herunterladen.</p>
          </div>
          <Link
            href="/blueprints/new"
            className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            + Blueprint
          </Link>
        </div>

        {blueprints.length === 0 ? (
          <div className="border border-dashed border-gray-800 rounded-xl p-16 text-center">
            <p className="text-gray-500 text-lg">Noch keine Blueprints.</p>
            <Link href="/blueprints/new" className="text-violet-400 hover:text-violet-300 mt-2 inline-block">
              Ersten Blueprint erstellen →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {blueprints.map((bp) => (
              <div key={bp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{bp.name}</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Komposition: {bp.composition_id}</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/blueprints/${bp.id}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Bearbeiten
                  </Link>
                  <RenderButton blueprintId={bp.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/history" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Render-Historie ansehen →
          </Link>
        </div>
      </div>
    </main>
  );
}
