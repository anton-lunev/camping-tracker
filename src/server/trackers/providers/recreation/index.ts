import { fetchData } from "@/server/trackers/providers/recreation/fetch";
import { findAvailablePlaces } from "@/server/trackers/providers/recreation/filters";
import {
  filterByWeekDay,
  filterCertainDays,
  keepOnlyNew,
} from "@/server/trackers/providers/common/filters";
import { Logger } from "@/server/utils/logger";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";

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

    const result = matchingSites.filter((item) =>
      keepOnlyNew(handledCampSites, item),
    );

    Logger.info(
      "[RecreationAdapter]",
      `Overall found ${matchingSites.length} available sites, where ${result.length} new sites`,
    );

    return result;
  });
}
