import type { CampsitesResponse } from "@/server/trackers/providers/recreation/schema";
import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getFormattedDateWithoutTz } from "@/lib/date";

/** Converts response to CampsiteData */
export function getCampsiteData(response: CampsitesResponse): CampsiteData[] {
  const availableSpots: CampsiteData[] = [];

  for (const campsite of Object.values(response.campsites)) {
    for (const [date, value] of Object.entries(campsite.availabilities)) {
      availableSpots.push({
        date: getFormattedDateWithoutTz(date),
        siteId: campsite.site,
        siteName: campsite.site,
        campingId: campsite.campsite_id,
        campingName: campsite.loop,
        isFree: value === "Available",
      });
    }
  }
  return availableSpots;
}
