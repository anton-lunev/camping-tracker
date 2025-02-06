const BASE_URL = "https://www.recreation.gov";

export const PROVIDER_CONFIG = {
  BASE_URL,
  API_URL: `${BASE_URL}/api/camps/availability/campground/:campingId/month`,
  CAMPGROUND_URL: `${BASE_URL}/camping/campgrounds/:campId`,
} as const;
