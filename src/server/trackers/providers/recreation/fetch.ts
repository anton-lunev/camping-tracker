import { CampsitesResponse, campsitesResponseSchema } from "./schema";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { BaseError, handleZodError, NetworkError } from "../common/errors";
import { z } from "zod";

// TODO move to utils
/**
 * Returns an array of strings with month period.
 * @param start - Start date in YYYY-MM-DD format.
 * @param end - End date in YYYY-MM-DD format.
 * @returns Array of date strings.
 */
function getDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1,
  );

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return dates;
}

/**
 * Fetch data using native fetch for a range of dates.
 * @param {string} campingId - The ID of the campground.
 * @param {string} start - Start date in YYYY-MM-DD format.
 * @param {string} end - End date in YYYY-MM-DD format.
 * @returns - A promise that resolves to an array of responses.
 */
export async function fetchData(
  campingId: string,
  start: string,
  end: string,
): Promise<CampsitesResponse[]> {
  const fetchPromises = getDates(start, end).map(async (date) => {
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
  });

  return Promise.all(fetchPromises);
}
