// This file imports from server provider adapter.
// Need to be careful to not import unnecessary files from server.

import {
  CampProvider,
  getProviderFromString,
} from "@/server/trackers/providers/providerAdapterFactory";
import { PROVIDER_CONFIG as RECREATION_CONFIG } from "@/server/trackers/providers/recreation/config";
import { router } from "@/server/utils/router";
import { PROVIDER_CONFIG as RESERVE_CALIFORNIA_CONFIG } from "@/server/trackers/providers/reserve-california/config";
import { parseId } from "@/server/trackers/providers/reserve-california/parseId";

export function getCampingUrl(providerStr: string, campingId: string) {
  const provider = getProviderFromString(providerStr);
  switch (provider) {
    case CampProvider.RECREATION:
      return router.resolve(RECREATION_CONFIG.CAMPGROUND_URL, { campingId });
    case CampProvider.RESERVE_CALIFORNIA:
      return router.resolve(
        RESERVE_CALIFORNIA_CONFIG.CAMPGROUND_URL,
        parseId(campingId),
      );
    default:
      return "#";
  }
}

export function getCampsiteUrl(providerStr: string, siteId: string) {
  const provider = getProviderFromString(providerStr);
  switch (provider) {
    case CampProvider.RECREATION:
      return router.resolve(RECREATION_CONFIG.CAMPSITE_URL, { siteId });
    case CampProvider.RESERVE_CALIFORNIA:
      return "";
    default:
      return "";
  }
}
