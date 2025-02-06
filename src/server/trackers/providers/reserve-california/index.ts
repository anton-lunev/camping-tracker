import { fetchData } from "@/server/trackers/providers/reserve-california/fetch";
import { findAvailablePlaces } from "@/server/trackers/providers/reserve-california/filters";
import {
  filterByWeekDay,
  filterCertainDays,
  keepOnlyNew,
} from "@/server/trackers/providers/common/filters";
import { Logger } from "@/server/utils/logger";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";

export function findAvailableSpots(
  params: { campingId: string; parkId: string },
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
  handledCampSites: CampsiteData[],
) {
  return fetchData(params.campingId, start, end).then((response) => {
    const matchingSites = findAvailablePlaces(response)
      .filter((item) => filterByWeekDay(item, weekDays))
      .filter((item) => filterCertainDays(item, days));
    const result = matchingSites.filter((item) =>
      keepOnlyNew(handledCampSites, item),
    );

    Logger.info(
      "[ReserveCaliforniaAdapter]",
      `Overall found ${matchingSites.length} available sites, where ${result.length} new sites`,
    );

    return result;
  });
}
