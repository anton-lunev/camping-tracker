import { fetchData } from "@/server/trackers/providers/recreation/fetch";
import { CampsiteData } from "@/server/trackers/types";
import { findAvailablePlaces } from "@/server/trackers/providers/recreation/filters";
import {
  filterByWeekDay,
  filterCertainDays,
  keepOnlyNew,
} from "@/server/trackers/providers/common/filters";

export function findAvailableSpots(
  campingId: string,
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
  handledCampSites: CampsiteData[],
) {
  return fetchData(campingId, start, end).then((responses) => {
    const matchingSites = responses
      .reduce<CampsiteData[]>(
        (acc, res) => acc.concat(findAvailablePlaces(res)),
        [],
      )
      .filter((elem) => filterByWeekDay(elem, weekDays))
      .filter((elem) => filterCertainDays(elem, days));

    const result = matchingSites.filter(
      keepOnlyNew.bind(null, handledCampSites),
    );

    console.log(
      `Overall found ${matchingSites.length} available sites in https://www.recreation.gov/camping/campgrounds/${campingId}`,
    );

    return result;
  });
}
