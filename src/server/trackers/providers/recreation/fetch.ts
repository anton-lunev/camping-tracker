import type { CampsitesResponse } from "./schema";
import { campgroundSchema, campsitesResponseSchema } from "./schema";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import {
  BaseError,
  handleZodError,
  NetworkError,
} from "@/server/trackers/common/errors";
import { z } from "zod";
import { getMonthsInRange } from "@/lib/date";
import type { CampingInfo } from "@/server/trackers/providers/providerAdapter";

// import { exportResponse } from "@/server/utils/exportResponse";

/** Fetch campsites for given data range */
export async function fetchData({
  campingId,
  startDate,
  endDate,
}: {
  campingId: string;
  startDate: string;
  endDate: string;
}): Promise<CampsitesResponse[]> {
  const fetchPromises = getMonthsInRange(startDate, endDate).map(
    async (date) => {
      const url = router.resolve(
        PROVIDER_CONFIG.API_URL,
        { campingId },
        { start_date: `${date}T00:00:00.000Z` },
      );

      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          throw new NetworkError(
            `HTTP error! status: ${response.status} ${response.statusText}`,
          );
        }
        const data = await response.json();
        // exportResponse(data, date);
        try {
          return campsitesResponseSchema.parse(data);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw handleZodError(error, { date, campingId });
          }
          throw error;
        }
      } catch (error) {
        if (error instanceof BaseError) throw error;
        throw new BaseError("An unexpected error occurred", error as Error, {
          date,
          campingId,
          url,
        });
      }
    },
  );

  return Promise.all(fetchPromises);
}

export async function fetchCampingInfo(
  campingId: string,
): Promise<CampingInfo> {
  const response = await fetch(
    router.resolve(PROVIDER_CONFIG.CAMPGROUND_API_URL, { campingId }),
    { headers: { "Content-Type": "application/json" } },
  );
  if (!response.ok || response.status !== 200) {
    throw new Error("Failed to fetch camping info from reservecalifornia");
  }

  const rawData = await response.json();

  const data = campgroundSchema.parse(rawData);
  return { name: data.campground.facility_name };
}
