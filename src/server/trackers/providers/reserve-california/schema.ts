import { z } from "zod";

const sliceSchema = z.object({
  Date: z.string(),
  IsFree: z.boolean(),
  IsBlocked: z.boolean(),
  IsWalkin: z.boolean(),
  ReservationId: z.number(),
  Lock: z.string().nullish(),
  MinStay: z.number(),
  IsReservationDraw: z.boolean(),
});

const mapInfoSchema = z.object({
  UnitImage: z.string(),
  UnitImageVBT: z.string(),
  ImageCoordinateX: z.number(),
  ImageCoordinateY: z.number(),
  ImageWidth: z.number(),
  ImageHeight: z.number(),
  FontSize: z.number(),
  Latitude: z.number(),
  Longitude: z.number(),
});

const unitSchema = z.object({
  UnitId: z.number(),
  Name: z.string(),
  ShortName: z.string(),
  RecentPopups: z.number(),
  IsAda: z.boolean(),
  AllowWebBooking: z.boolean(),
  MapInfo: mapInfoSchema,
  IsWebViewable: z.boolean(),
  IsFiltered: z.boolean(),
  UnitCategoryId: z.number(),
  SleepingUnitIds: z.array(z.number()),
  UnitTypeGroupId: z.number(),
  UnitTypeId: z.number(),
  UseType: z.number(),
  VehicleLength: z.number(),
  OrderBy: z.number(),
  SliceCount: z.number(),
  AvailableCount: z.number(),
  IsFavourite: z.boolean(),
  Slices: z.record(sliceSchema),
  OrderByRaw: z.number(),
  StartTime: z.string().nullish(),
  EndTime: z.string().nullish(),
});

const restrictionsSchema = z.object({
  FutureBookingStarts: z.string(),
  FutureBookingEnds: z.string(),
  MinimumStay: z.number(),
  MaximumStay: z.number(),
  IsRestrictionValid: z.boolean(),
  Time: z.string(),
});

export const facilitySchema = z.object({
  FacilityId: z.number(),
  Name: z.string(),
  Description: z.string(),
  FacilityType: z.number(),
  FacilityBehaviourType: z.number(),
  FacilityMapSize: z.boolean(),
  FacilityImage: z.string(),
  FacilityImageVBT: z.string(),
  DatesInSeason: z.number(),
  DatesOutOfSeason: z.number(),
  SeasonDates: z.record(z.boolean()),
  TrafficStatuses: z.record(z.unknown()),
  UnitCount: z.number(),
  AvailableUnitCount: z.number(),
  SliceCount: z.number(),
  AvailableSliceCount: z.number(),
  Restrictions: restrictionsSchema,
  Units: z.record(unitSchema),
  Latitude: z.number(),
  Longitude: z.number(),
  TimebaseMaxHours: z.number(),
  TimebaseMinHours: z.number(),
  TimebaseDuration: z.number(),
  IsReservationDrawActive: z.boolean(),
  DrawBookingStartDate: z.string(),
  DrawBookingEndDate: z.string(),
  ReservationDrawDetail: z.any().nullish(),
  WalkinCounts: z.any().nullish(),
});

export type Facility = z.infer<typeof facilitySchema>;

const filtersSchema = z.object({
  InSeasonOnly: z.string(),
  WebOnly: z.string(),
  IsADA: z.string(),
  SleepingUnitId: z.string(),
  MinVehicleLength: z.string(),
  UnitCategoryId: z.string(),
});

export const searchResponseSchema = z.object({
  Message: z.string(),
  Filters: filtersSchema,
  UnitTypeId: z.number(),
  StartDate: z.string(),
  EndDate: z.string(),
  NightsRequested: z.number(),
  NightsActual: z.number(),
  TodayDate: z.string(),
  TimeZone: z.string(),
  TimeStamp: z.string(),
  MinDate: z.string(),
  MaxDate: z.string(),
  AvailableUnitsOnly: z.boolean(),
  UnitSort: z.string(),
  TimeGrid: z.boolean(),
  ForUnit: z.boolean(),
  UnitId: z.number(),
  TimeBetween: z.string(),
  TimeBetweenEval: z.string(),
  Facility: facilitySchema,
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;
