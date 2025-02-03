import { formatInfoToMessage, postToChannel } from "./messanger";
import { CampsiteData } from "@/server/trackers/types";
import * as reserveCalifornia from "@/server/trackers/providers/reserve-california";
import * as recreation from "@/server/trackers/providers/recreation";

// TODO: move to DB
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
  weekDays: number[],
  start: string,
  end: string,
): void {
  recreation
    .findAvailableSpots(
      campingId,
      days,
      weekDays,
      start,
      end,
      alreadyFoundCampSites,
    )
    .then((result) => {
      if (!result.length) return;

      alreadyFoundCampSites = [...alreadyFoundCampSites, ...result];
      console.info(
        `Found ${result.length} new camp sites in https://www.recreation.gov/camping/campgrounds/${campingId}`,
      );
      console.info(result);

      postToChannel(
        formatInfoToMessage(
          result,
          `https://www.recreation.gov/camping/campgrounds/${campingId}`,
        ),
      ).catch((error) => console.error("Failed to post to Telegram:", error));
    })
    .catch((error) => console.error("Error finding campsites:", error));
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
  weekDays: number[],
  start: string,
  end: string,
): void {
  reserveCalifornia
    .findAvailableSpots(
      params,
      days,
      weekDays,
      start,
      end,
      alreadyFoundCampSites,
    )
    .then((result) => {
      if (!result.length) return;

      alreadyFoundCampSites = [...alreadyFoundCampSites, ...result];
      console.info(
        `Found ${result.length} new camp sites in ${params.campingId}`,
      );
      console.info(result);

      postToChannel(
        formatInfoToMessage(
          result,
          `https://www.reservecalifornia.com/Web/Default.aspx#!park/${params.parkId}/${params.campingId}`,
        ),
      )
        .then(() => console.log("Message posted successfully"))
        .catch((error) => console.error("Failed to post to Telegram:", error));
    })
    .catch((error) => console.error("Error finding campsites:", error));
}
