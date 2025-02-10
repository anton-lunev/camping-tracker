import { SearchResponse } from "./schema";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getFormattedDateWithoutTz } from "@/lib/date";

/** Converts response to CampsiteData */
export function getCampsiteData(data: SearchResponse): CampsiteData[] {
  return Object.values(data.Facility.Units ?? {}).flatMap((unitInfo) =>
    Object.values(unitInfo.Slices).map(
      (item) =>
        ({
          date: getFormattedDateWithoutTz(item.Date),
          siteId: unitInfo.UnitId.toString(),
          siteName: unitInfo.ShortName,
          campingName: data.Facility.Name,
          campingId: data.Facility.FacilityId.toString(),
          isFree: item.IsFree,
        }) satisfies CampsiteData,
    ),
  );
}
