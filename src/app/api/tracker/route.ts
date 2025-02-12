import {
  createTracker,
  removeTracker,
  updateTracker,
} from "@/app/api/tracker/actions";
import type { Tracker } from "@/db/schema";
import type { NewTracker } from "@/db/queries/trackers";

export async function POST(request: Request) {
  const res = await request.json();
  await createTracker(res as NewTracker);
  return Response.json({ success: true });
}

export async function PUT(request: Request) {
  const res = await request.json();
  await updateTracker(res as Tracker);
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const res = await request.json();
  await removeTracker(res.id as string);
  return Response.json({ success: true });
}
