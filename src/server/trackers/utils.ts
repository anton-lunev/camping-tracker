import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import type { TrackingStateItem } from "@/db/schema";

export function getTrackingStateItem(
  campingId: string,
  data: CampsiteData[] | undefined,
): TrackingStateItem {
  return {
    campingId,
    sites:
      data?.map((item) => ({
        date: item.date,
        siteId: item.siteId,
        isFree: true,
      })) ?? [],
  };
}
