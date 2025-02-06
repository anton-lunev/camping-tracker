import { SearchResponse, searchResponseSchema } from "@/server/trackers/providers/reserve-california/schema";
import { PROVIDER_CONFIG } from "./config";

/**
 * Fetch data using native fetch with a POST request.
 * @param campingId - The ID of the campground.
 * @param start - Start date in YYYY-MM-DD format.
 * @param end - End date in YYYY-MM-DD format.
 */
export async function fetchData(
  campingId: string,
  start: string,
  end: string,
): Promise<SearchResponse> {
  const url = PROVIDER_CONFIG.API_URL;
  const payload = {
    IsADA: false,
    MinVehicleLength: 0,
    UnitCategoryId: 1,
    StartDate: start,
    WebOnly: true,
    UnitTypesGroupIds: [] as number[],
    SleepingUnitId: 83,
    EndDate: end,
    UnitSort: "orderby",
    InSeasonOnly: true,
    FacilityId: campingId,
    RestrictADA: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const rawData = await response.json();
  return searchResponseSchema.parse(rawData);
}
