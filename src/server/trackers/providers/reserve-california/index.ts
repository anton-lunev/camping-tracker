import { fetchData1 } from "@/server/trackers/providers/reserve-california/fetch";
import { findUnits } from "@/server/trackers/providers/reserve-california/filters";
import { filterByWeekDay, keepOnlyNew } from "@/server/trackers/filters";
import { CampsiteData } from "@/server/trackers/types";

export function findAvailableSpots(
  params: { campingId: string; parkId: string },
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
  alreadyFoundCampSites: CampsiteData[],
) {
  return fetchData1(params.campingId, start, end).then((response) => {
    const matchingSites = findUnits(response, days);
    const result = matchingSites
      .filter((elem) => filterByWeekDay(elem, weekDays))
      .filter(keepOnlyNew.bind(null, alreadyFoundCampSites));

    console.log(
      `Overall found ${matchingSites.length} available sites in https://www.reservecalifornia.com/Web/Default.aspx#!park/${params.parkId}/${params.campingId}`,
    );

    return result;
  });
}
