import type { CampsitesResponse } from "@/server/trackers/providers/recreation/schema";
import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getFormattedDateWithoutTz } from "@/lib/date";

const FREE_STATUSES = new Set(["Available", "Open"]);

/** Converts response to CampsiteData */
export function getCampsiteData(
  response: CampsitesResponse,
  campingId: string,
  campingName: string,
): CampsiteData[] {
  const availableSpots: CampsiteData[] = [];
  for (const campsite of Object.values(response.campsites)) {
    for (const [date, value] of Object.entries(campsite.availabilities)) {
      availableSpots.push({
        date: getFormattedDateWithoutTz(date),
        siteId: campsite.campsite_id,
        siteName: campsite.site,
        campingId,
        campingName: campingName ?? campsite.loop,
        isFree: FREE_STATUSES.has(value),
      });
    }
  }
  return availableSpots;
}
