import type { CampsitesResponse } from "../schema";

export const mockResponse: CampsitesResponse = {
  campsites: {
    site1: {
      campsite_id: "site1",
      site: "A1",
      loop: "Loop A",
      campsite_reserve_type: "Site-Specific",
      availabilities: {
        "2024-03-20T00:00:00Z": "Available",
        "2024-03-21T00:00:00Z": "Reserved",
        "2024-03-22T00:00:00Z": "Reserved",
      },
      quantities: {},
      campsite_type: "STANDARD",
      type_of_use: "Overnight",
      min_num_people: 1,
      max_num_people: 6,
      capacity_rating: "Single",
      hide_external: false,
      campsite_rules: null,
      supplemental_camping: null,
    },
    site2: {
      campsite_id: "site2",
      site: "A2",
      loop: "Loop A",
      campsite_reserve_type: "Site-Specific",
      availabilities: {
        "2024-03-20T00:00:00Z": "Reserved",
        "2024-03-21T00:00:00Z": "Available",
        "2024-03-22T00:00:00Z": "Available",
      },
      quantities: {},
      campsite_type: "STANDARD",
      type_of_use: "Overnight",
      min_num_people: 1,
      max_num_people: 6,
      capacity_rating: "Single",
      hide_external: false,
      campsite_rules: null,
      supplemental_camping: null,
    },
  },
  count: 2,
};
