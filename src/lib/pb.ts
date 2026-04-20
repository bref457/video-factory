import PocketBase from "pocketbase";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_PB_URL || "http://localhost:8090"
);

export default pb;

export interface Blueprint {
  id: string;
  name: string;
  composition_id: string;
  params: Record<string, unknown>;
  created: string;
  updated: string;
}

export interface RenderHistory {
  id: string;
  blueprint_id: string;
  output_file: string;
  status: "pending" | "rendering" | "done" | "error";
  error_message?: string;
  created: string;
}