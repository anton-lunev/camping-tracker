import { runActiveTrackers } from "@/server/trackers/runActiveTrackers";

export async function GET() {
  void runActiveTrackers();
  return Response.json("success");
}
