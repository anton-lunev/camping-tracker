const RDR_API =
  "https://california-rdr.prod.cali.rd12.recreation-management.tylerapp.com/rdr";

export const PROVIDER_CONFIG = {
  BASE_URL: "https://www.reservecalifornia.com",
  API_URL: `${RDR_API}/search/grid`,
  CAMPGROUND_API_URL: `${RDR_API}/fd/facilities/:campingId`,
  PARK_API_URL: `${RDR_API}/fd/citypark/:parkId`,
  CAMPGROUND_URL: "https://www.reservecalifornia.com/park/:parkId/:campingId",
  IMG_URL:
    "https://www.reservecalifornia.com/images/California/ParkImages/Place/:parkId.jpg",
} as const;
