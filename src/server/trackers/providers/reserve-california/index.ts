import { fetchData } from "@/server/trackers/providers/reserve-california/fetch";
import { findAvailablePlaces } from "@/server/trackers/providers/reserve-california/filters";
import {
  filterByWeekDay,
  filterCertainDays,
  keepOnlyNew,
} from "@/server/trackers/providers/common/filters";
import { CampsiteData } from "@/server/trackers/types";

export function findAvailableSpots(
  params: { campingId: string; parkId: string },
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
  handledCampSites: CampsiteData[],
) {
  return fetchData(params.campingId, start, end).then((response) => {
    const matchingSites = findAvailablePlaces(response);
    const result = matchingSites
      .filter((item) => filterByWeekDay(item, weekDays))
      .filter((item) => filterCertainDays(item, days))
      .filter((item) => keepOnlyNew(handledCampSites, item));

    console.log(
      `Overall found ${matchingSites.length} available sites in https://www.reservecalifornia.com/Web/Default.aspx#!park/${params.parkId}/${params.campingId}`,
    );

    return result;
  });
}
