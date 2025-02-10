import type { CampsitesResponse } from "./schema";
import { campsitesResponseSchema } from "./schema";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { BaseError, handleZodError, NetworkError } from "@/server/trackers/common/errors";
import { z } from "zod";
import { getMonthsInRange } from "@/lib/date";

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
