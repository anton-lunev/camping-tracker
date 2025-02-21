import type { CampsiteData, ProviderAdapter } from "../providerAdapter";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { fetchCampingInfo, fetchData } from "./fetch";
import { getCampsiteData } from "./getCampsiteData";

export class RecreationAdapter implements ProviderAdapter {
  async getCampsiteData(params: {
    campingId: string;
    startDate: string;
    endDate: string;
  }) {
    const responses = await fetchData(params);
    return responses.flatMap((res) => getCampsiteData(res, params.campingId));
  }

  getCampingInfo(campingId: string) {
    return fetchCampingInfo(campingId);
  }

  getNotificationData(results: CampsiteData[], campingId: string) {
    if (!results.length) return null;

    return {
      results,
      campingName: results[0].campingName,
      campingUrl: router.resolve(PROVIDER_CONFIG.CAMPGROUND_URL, { campingId }),
      campsiteUrl: PROVIDER_CONFIG.CAMPSITE_URL,
      count: results.length,
    };
  }
}
