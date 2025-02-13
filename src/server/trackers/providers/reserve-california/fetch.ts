import type { SearchResponse } from "@/server/trackers/providers/reserve-california/schema";
import { searchResponseSchema } from "@/server/trackers/providers/reserve-california/schema";
import { PROVIDER_CONFIG } from "./config";
import { BaseError, handleZodError, NetworkError } from "@/server/trackers/common/errors";
import { z } from "zod";
import { getMonthDatePairs } from "@/lib/date";

/** Fetch campings for given date range */
export async function fetchData({
  campingId,
  startDate,
  endDate,
}: {
  campingId: string;
  startDate: string;
  endDate: string;
}): Promise<SearchResponse[]> {
  const url = PROVIDER_CONFIG.API_URL;
  const fetchPromises = getMonthDatePairs(startDate, endDate).map(
    async ([StartDate, EndDate]) => {
      const payload = {
        IsADA: false,
        MinVehicleLength: 0,
        UnitCategoryId: 1,
        StartDate,
        WebOnly: true,
        UnitTypesGroupIds: [] as number[],
        SleepingUnitId: 83,
        EndDate,
        UnitSort: "orderby",
        InSeasonOnly: true,
        FacilityId: campingId,
        RestrictADA: false,
      };

      console.log("payload", payload);

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
        // exportResponse(
        //   rawData,
        //   `${CampProvider.RESERVE_CALIFORNIA}_${campingId}_${StartDate}_${EndDate}`,
        // );

        try {
          return searchResponseSchema.parse(rawData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw handleZodError(error, { campingId, StartDate, EndDate });
          }
          throw error;
        }
      } catch (error) {
        if (error instanceof BaseError) throw error;
        throw new BaseError("An unexpected error occurred", error as Error, {
          campingId,
          StartDate,
          EndDate,
        });
      }
    },
  );

  return Promise.all(fetchPromises);
}
