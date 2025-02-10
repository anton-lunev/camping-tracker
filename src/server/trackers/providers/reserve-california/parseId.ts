export function parseId(id: string) {
  const [parkId, campingId] = id.split(":");
  return { parkId, campingId } as const;
}
