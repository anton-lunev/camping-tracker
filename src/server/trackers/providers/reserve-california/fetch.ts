import { SearchResponse, searchResponseSchema } from "@/server/trackers/providers/reserve-california/schema";
import { PROVIDER_CONFIG } from "./config";
import { BaseError, handleZodError, NetworkError } from "../common/errors";
import { z } from "zod";

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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new NetworkError(
        `HTTP error! status: ${response.status} ${response.statusText}`,
      );
    }

    const rawData = await response.json();

    try {
      return searchResponseSchema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw handleZodError(error, { campingId, start, end });
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new BaseError("An unexpected error occurred", error as Error, {
      campingId,
      start,
      end,
    });
  }
}
