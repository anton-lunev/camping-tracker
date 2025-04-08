import { z } from "zod";

const AvailabilityStatus = z.enum([
  "Not Reservable",
  "Reserved",
  "Available",
  "Closed",
]);

export const campsiteSchema = z.object({
  campsite_id: z.string(),
  site: z.string(),
  loop: z.string(),
  campsite_reserve_type: z.string(),
  availabilities: z.record(AvailabilityStatus),
  quantities: z.record(z.number()),
  campsite_type: z.string(),
  type_of_use: z.string(),
  min_num_people: z.number(),
  max_num_people: z.number(),
  capacity_rating: z.string().optional(),
  hide_external: z.boolean(),
  campsite_rules: z.union([z.object({}), z.null()]),
  supplemental_camping: z.union([z.object({}), z.null()]),
});

export type Campsite = z.infer<typeof campsiteSchema>;

export const campsitesResponseSchema = z.object({
  campsites: z.record(campsiteSchema),
  count: z.number(),
});

export type CampsitesResponse = z.infer<typeof campsitesResponseSchema>;

export const campgroundSchema = z.object({
  campground: z.object({
    facility_name: z.string(),
  }),
});

export const campgroundAssetsSchema = z.object({
  result: z.array(
    z.object({
      url: z.string(),
    }),
  ),
});
