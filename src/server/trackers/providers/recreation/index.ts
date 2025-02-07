import { fetchData } from "@/server/trackers/providers/recreation/fetch";
import { findAvailablePlaces } from "@/server/trackers/providers/recreation/filters";
import {
  filterByWeekDay,
  filterCertainDays,
  keepOnlyNew,
} from "@/server/trackers/providers/common/filters";
import { Logger } from "@/server/utils/logger";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { TrackingStateItem } from "@/db/schema";

export function findAvailableSpots(
  campingId: string,
  days: string[],
  weekDays: number[],
  start: string,
  end: string,
  trackingState?: TrackingStateItem,
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
      keepOnlyNew(trackingState, item),
    );

    Logger.info(
      "[RecreationAdapter]",
      `available sites: ${matchingSites.length}, new sites: ${result.length}`,
    );

    return result;
  });
}
