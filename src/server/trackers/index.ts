import {
  CampsiteData,
  CampsitesResponse,
  filterByWeekDay,
  filterCertainDays,
  findAvailablePlaces,
  getDayOfWeek,
  keepOnlyNew,
} from "./filters";
import { FacilityData, fetchData, fetchData1 } from "./fetcher";
import { formatInfoToMessage, postToChannel } from "./messanger";

let alreadyFoundCampSites: CampsiteData[] = [];

/**
 * Finds and processes available campsites for Recreation.gov.
 * @param campingId - The ID of the campground.
 * @param days - Specific dates to filter (e.g., ["2025-01-16"]).
 * @param weekDays - Weekdays to filter (e.g., ["Monday", "Tuesday"]).
 * @param start - Start date for the search.
 * @param end - End date for the search.
 */
export function findCamp(
  campingId: string,
  days: string[],
  weekDays: string[],
  start: string,
  end: string,
): void {
  fetchData(campingId, start, end)
    .then((responses: CampsitesResponse[]) => {
      const matchingSites = responses
        .reduce<CampsiteData[]>(
          (acc, res) => acc.concat(findAvailablePlaces(res)),
          [],
        )
        .filter((elem) => filterByWeekDay(elem, weekDays))
        .filter((elem) => filterCertainDays(elem, days));

      const result = matchingSites.filter(
        keepOnlyNew.bind(null, alreadyFoundCampSites),
      );

      console.log(
        `Overall found ${matchingSites.length} available sites in https://www.recreation.gov/camping/campgrounds/${campingId}`,
      );

      if (result.length) {
        console.info(
          `Found ${result.length} new camp sites in https://www.recreation.gov/camping/campgrounds/${campingId}`,
        );
        console.info(result);

        alreadyFoundCampSites = [...alreadyFoundCampSites, ...result];
        postToChannel(
          formatInfoToMessage(
            result,
            `https://www.recreation.gov/camping/campgrounds/${campingId}`,
          ),
        ).catch((error) => console.error("Failed to post to Telegram:", error));
      }
    })
    .catch((error) => console.error("Error finding campsites:", error));
}

/**
 * Finds available units within a facility's data.
 * @param data - The facility data from the response.
 * @param days - Specific dates to filter (e.g., ["2025-01-16"]).
 * @returns An array of available campsites.
 */
function findUnits(data: FacilityData, days: string[]): CampsiteData[] {
  const availableUnits: CampsiteData[] = [];

  Object.entries(data.Facility.Units ?? {}).forEach(([unitId, unitInfo]) => {
    const freeDays = Object.entries(unitInfo.Slices)
      .filter(
        ([key, val]) =>
          !days.length || (days.includes(key.split("T")[0]) && val.IsFree),
      )
      .map(([date]) => ({
        date,
        day: getDayOfWeek(date),
        site: unitId,
        campsite: data.Facility.Name,
        campsiteId: data.Facility.FacilityId,
      }));

    availableUnits.push(...freeDays);
  });

  return availableUnits;
}

/**
 * Finds and processes available campsites for ReserveCalifornia.com.
 * @param params - Object containing campground and park IDs.
 * @param days - Specific dates to filter (e.g., ["2025-01-16"]).
 * @param weekDays - Weekdays to filter (e.g., ["Monday", "Tuesday"]).
 * @param start - Start date for the search.
 * @param end - End date for the search.
 */
export function findCamp1(
  params: { campingId: string; parkId: string },
  days: string[],
  weekDays: string[],
  start: string,
  end: string,
): void {
  fetchData1(params.campingId, start, end)
    .then((response) => {
      const matchingSites = findUnits(response, days);

      const result = matchingSites
        .filter((elem) => filterByWeekDay(elem, weekDays))
        .filter(keepOnlyNew.bind(null, alreadyFoundCampSites));

      console.log(
        `Overall found ${matchingSites.length} available sites in https://www.reservecalifornia.com/Web/Default.aspx#!park/${params.parkId}/${params.campingId}`,
      );

      if (result.length) {
        console.info(
          `Found ${result.length} new camp sites in ${params.campingId}`,
        );
        console.info(result);

        alreadyFoundCampSites = [...alreadyFoundCampSites, ...result];
        postToChannel(
          formatInfoToMessage(
            result,
            `https://www.reservecalifornia.com/Web/Default.aspx#!park/${params.parkId}/${params.campingId}`,
          ),
        )
          .then(() => console.log("Message posted successfully"))
          .catch((error) =>
            console.error("Failed to post to Telegram:", error),
          );
      }
    })
    .catch((error) => console.error("Error finding campsites:", error));
}
