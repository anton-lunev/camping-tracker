import type { CampsiteData, ProviderAdapter } from "../providerAdapter";
import { PROVIDER_CONFIG } from "./config";
import { router } from "@/server/utils/router";
import { fetchData } from "@/server/trackers/providers/recreation/fetch";
import { getCampsiteData } from "@/server/trackers/providers/recreation/getCampsiteData";

export class RecreationAdapter implements ProviderAdapter {
  async getCampsiteData(params: {
    campingId: string;
    startDate: string;
    endDate: string;
  }) {
    const responses = await fetchData(params);
    return responses.flatMap((res) => getCampsiteData(res));
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
