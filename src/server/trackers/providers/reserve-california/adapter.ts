import type { CampsiteData, ProviderAdapter } from "../providerAdapter";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import {
  fetchCampingInfo,
  fetchData,
} from "@/server/trackers/providers/reserve-california/fetch";
import { getCampsiteData } from "./getCampsiteData";
import { parseId } from "@/server/trackers/providers/reserve-california/parseId";

export class ReserveCaliforniaAdapter implements ProviderAdapter {
  async getCampsiteData(params: {
    campingId: string;
    startDate: string;
    endDate: string;
  }) {
    const { campingId } = parseId(params.campingId);
    const responses = await fetchData({
      campingId,
      startDate: params.startDate,
      endDate: params.endDate,
    });
    return responses.flatMap((res) => getCampsiteData(res));
  }

  getCampingInfo(campingId: string) {
    return fetchCampingInfo(campingId);
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
