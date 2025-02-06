import { CampAdapter } from "../campAdapter";
import { CampsiteData } from "../../types";
import * as reserveCalifornia from "./index";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { Logger } from "@/server/utils/logger";

const logger = Logger.for("ReserveCaliforniaAdapter");

export class ReserveCaliforniaAdapter implements CampAdapter {
    async findCamp(
        campId: string,
        days: string[],
        weekDays: number[],
        start: string,
        end: string,
        handledCampSites: CampsiteData[] = [],
    ): Promise<CampsiteData[]> {
        const params = {
            campId,
            days,
            weekDays,
            start,
            end,
            handledCampSites,
        };
        logger.debug("Searching for available spots", params);

        const [parkId, campingId] = campId.split(":");
        const results = await reserveCalifornia.findAvailableSpots(
            { parkId, campingId },
            days,
            weekDays,
            start,
            end,
            handledCampSites,
        );
        logger.info(`Found ${results.length} new camp sites`, params);

        return results;
    }

    getNotificationData(results: CampsiteData[], id: string) {
        if (!results.length) return null;

        const [parkId, campingId] = id.split(":");
        return {
            results,
            url: router.resolve(PROVIDER_CONFIG.CAMPGROUND_URL, { parkId, campingId }),
            count: results.length,
        };
    }
}
