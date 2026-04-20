import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import pb from "@/lib/pb";

let bundleLocation: string | null = null;

async function getBundle(): Promise<string> {
  if (bundleLocation) return bundleLocation;
  const { bundle } = await import("@remotion/bundler");
  bundleLocation = await bundle({
    entryPoint: path.resolve(process.cwd(), "remotion/index.ts"),
    webpackOverride: (config) => config,
  });
  return bundleLocation;
}

export async function POST(req: NextRequest) {
  const { blueprintId } = await req.json();

  if (!blueprintId) {
    return NextResponse.json({ success: false, error: "blueprintId required" }, { status: 400 });
  }

  const blueprint = await pb.collection("blueprints").getOne(blueprintId);

  const historyRecord = await pb.collection("render_history").create({
    blueprint_id: blueprintId,
    status: "pending",
  });

  const outputDir = path.join(process.cwd(), "public", "renders");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, `${historyRecord.id}.mp4`);

  await pb.collection("render_history").update(historyRecord.id, { status: "rendering" });

  try {
    const { renderMedia, selectComposition } = await import("@remotion/renderer");
    const serveUrl = await getBundle();

    const composition = await selectComposition({
      serveUrl,
      id: blueprint.composition_id,
      inputProps: blueprint.params || {},
    });

    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputFile,
      inputProps: blueprint.params || {},
    });

    await pb.collection("render_history").update(historyRecord.id, {
      status: "done",
      output_file: `/renders/${historyRecord.id}.mp4`,
    });

    return NextResponse.json({
      success: true,
      historyId: historyRecord.id,
      outputFile: `/renders/${historyRecord.id}.mp4`,
    });
  } catch (error) {
    await pb.collection("render_history").update(historyRecord.id, {
      status: "error",
      error_message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
