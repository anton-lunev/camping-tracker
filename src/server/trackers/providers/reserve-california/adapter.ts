import { CampsiteData, ProviderAdapter } from "../providerAdapter";
import * as reserveCalifornia from "./index";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { Logger } from "@/server/utils/logger";
import { TrackingStateItem } from "@/db/schema";

const logger = Logger.for("ReserveCaliforniaAdapter");

export class ReserveCaliforniaAdapter implements ProviderAdapter {
  async findCamp(
    campId: string,
    days: string[],
    weekDays: number[],
    start: string,
    end: string,
    trackingState?: TrackingStateItem,
  ): Promise<CampsiteData[]> {
    const params = {
      campId,
      days,
      weekDays,
      start,
      end,
      trackingState,
    };
    logger.debug("Searching for available spots", params);

    const [parkId, campingId] = campId.split(":");
    const results = await reserveCalifornia.findAvailableSpots(
      { parkId, campingId },
      days,
      weekDays,
      start,
      end,
      trackingState,
    );
    logger.info(`Found ${results.length} new camp sites`, params);

    return results;
  }

  getNotificationData(results: CampsiteData[], id: string) {
    if (!results.length) return null;

    const [parkId, campingId] = id.split(":");
    return {
      results,
      campingName: results[0].campingName,
      campingUrl: router.resolve(PROVIDER_CONFIG.CAMPGROUND_URL, {
        parkId,
        campingId,
      }),
      count: results.length,
    };
  }
}
