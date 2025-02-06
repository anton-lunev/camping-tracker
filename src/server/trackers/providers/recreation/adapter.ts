import { CampAdapter } from "../campAdapter";
import { CampsiteData } from "../../types";
import * as recreation from "./index";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { Logger } from "@/server/utils/logger";
import { BaseError } from "../common/errors";

const logger = Logger.for("RecreationAdapter");

export class RecreationAdapter implements CampAdapter {
  async findCamp(
    campId: string,
    days: string[],
    weekDays: number[],
    start: string,
    end: string,
    handledCampSites: CampsiteData[],
  ): Promise<CampsiteData[]> {
    const params = {
      campId,
      days,
      weekDays,
      start,
      end,
    };

    try {
      logger.debug("Searching for available spots", params);

      const results = await recreation.findAvailableSpots(
        campId,
        days,
        weekDays,
        start,
        end,
        handledCampSites,
      );

      logger.info(`Found ${results.length} new camp sites`, params);
      return results;
    } catch (error) {
      if (error instanceof BaseError) {
        logger.error("Provider error occurred", {
          error: error.message,
          context: error.context,
          params,
        });
        throw error;
      }

      logger.error("Unexpected error occurred", {
        error: error instanceof Error ? error.message : String(error),
        params,
      });
      throw new BaseError(
        "Failed to search for available spots",
        error instanceof Error ? error : undefined,
        params,
      );
    }
  }

  getNotificationData(results: CampsiteData[], campId: string) {
    if (!results.length) return null;

    return {
      results,
      url: router.resolve(PROVIDER_CONFIG.CAMPGROUND_URL, { campId }),
      count: results.length,
    };
  }
}
