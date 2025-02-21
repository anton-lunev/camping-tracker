const BASE_URL = "https://www.recreation.gov";

export const PROVIDER_CONFIG = {
  BASE_URL,
  API_URL: `${BASE_URL}/api/camps/availability/campground/:campingId/month`,
  CAMPGROUND_URL: `${BASE_URL}/camping/campgrounds/:campingId`,
  CAMPGROUND_API_URL: `${BASE_URL}/api/camps/campgrounds/:campingId`,
  ASSET_API_URL: `${BASE_URL}/api/media/public/asset/:campingId`,
  CAMPSITE_URL: `${BASE_URL}/camping/campsites/:siteId`,
} as const;
