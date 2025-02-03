import { CampsitesResponse, campsitesResponseSchema } from "./schema";
import { constructUrl } from "@/utils/url";

const RECREATION_GOV_URL =
  "https://www.recreation.gov/api/camps/availability/campground/";

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
 * @returns {Promise<any[]>} - A promise that resolves to an array of responses.
 */
export async function fetchData(
  campingId: string,
  start: string,
  end: string,
): Promise<CampsitesResponse[]> {
  const fetchPromises = getDates(start, end).map(async (date) => {
    const url = constructUrl(`${RECREATION_GOV_URL}${campingId}/month`, {
      start_date: `${date}T00:00:00.000Z`,
    });

    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch data for date: ${date}`);
    }
    const data = response.json();
    return campsitesResponseSchema.parse(data);
  });

  return Promise.all(fetchPromises);
}
