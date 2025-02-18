export const PROVIDER_CONFIG = {
  BASE_URL: "https://www.reservecalifornia.com",
  API_URL: "https://calirdr.usedirect.com/RDR/rdr/search/grid",
  CAMPGROUND_API_URL:
    "https://calirdr.usedirect.com/RDR/rdr/fd/facilities/:campingId",
  CAMPGROUND_URL:
    "https://www.reservecalifornia.com/Web/Default.aspx#!park/:parkId/:campingId",
} as const;
