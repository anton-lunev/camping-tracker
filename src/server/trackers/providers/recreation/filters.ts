import { CampsitesResponse } from "@/server/trackers/providers/recreation/schema";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getFormattedDateWithoutTz } from "@/lib/date";

/** Extracts all available sites from the API response. */
export function findAvailablePlaces(
  response: CampsitesResponse,
): CampsiteData[] {
  const available: CampsiteData[] = [];
  const { campsites } = response;

  for (const campsiteId in campsites) {
    const campsite = campsites[campsiteId];
    for (const [date, value] of Object.entries(campsite.availabilities)) {
      if (value !== "Available") continue;
      available.push({
        date: getFormattedDateWithoutTz(date),
        siteId: campsite.site,
        siteName: campsite.site,
        campingId: campsite.campsite_id,
        campingName: campsite.loop,
      });
    }
  }
  return available;
}
