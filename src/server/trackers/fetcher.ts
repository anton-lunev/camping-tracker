import { constructUrl } from "@/utils/url";
import { CampsitesResponse } from "@/server/trackers/filters";

const RECREATION_GOV_URL =
  "https://www.recreation.gov/api/camps/availability/campground/";
const RESERVE_CALIFORNIA_URL =
  "https://calirdr.usedirect.com/RDR/rdr/search/grid";

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
    return response.json();
  });

  return Promise.all(fetchPromises);
}

export type FacilityData = {
  Facility: {
    Name: string;
    FacilityId: string;
    Units: Record<string, { Slices: Record<string, { IsFree: boolean }> }>;
  };
};

/**
 * Fetch data using native fetch with a POST request.
 * @param campingId - The ID of the campground.
 * @param start - Start date in YYYY-MM-DD format.
 * @param end - End date in YYYY-MM-DD format.
 */
export async function fetchData1(
  campingId: string,
  start: string,
  end: string,
): Promise<FacilityData> {
  const url = RESERVE_CALIFORNIA_URL;
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
  return response.json();
}
