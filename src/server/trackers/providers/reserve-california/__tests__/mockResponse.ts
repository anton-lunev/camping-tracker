import type { SearchResponse } from "../schema";

export const mockResponse: SearchResponse = {
  Message: "",
  Filters: {
    InSeasonOnly: "true",
    WebOnly: "true",
    IsADA: "false",
    SleepingUnitId: "83",
    MinVehicleLength: "0",
    UnitCategoryId: "1",
  },
  UnitTypeId: 0,
  StartDate: "2024-03-01",
  EndDate: "2024-03-31",
  NightsRequested: 1,
  NightsActual: 1,
  TodayDate: "2024-03-01",
  TimeZone: "PST",
  TimeStamp: "2024-03-01",
  MinDate: "2024-03-01",
  MaxDate: "2024-03-31",
  AvailableUnitsOnly: true,
  UnitSort: "orderby",
  TimeGrid: false,
  ForUnit: false,
  UnitId: 0,
  TimeBetween: "",
  TimeBetweenEval: "",
  Facility: {
    FacilityId: 456,
    Name: "Test Campground",
    Description: "Test Description",
    FacilityType: 1,
    FacilityBehaviourType: 1,
    FacilityMapSize: false,
    FacilityImage: "",
    FacilityImageVBT: "",
    DatesInSeason: 31,
    DatesOutOfSeason: 0,
    SeasonDates: {},
    TrafficStatuses: {},
    UnitCount: 2,
    AvailableUnitCount: 2,
    SliceCount: 62,
    AvailableSliceCount: 2,
    Restrictions: {
      FutureBookingStarts: "2024-03-01",
      FutureBookingEnds: "2024-03-31",
      MinimumStay: 1,
      MaximumStay: 14,
      IsRestrictionValid: true,
      Time: "2024-03-01",
    },
    Units: {
      Unit1: {
        UnitId: 1,
        Name: "Site 1",
        ShortName: "001",
        RecentPopups: 0,
        IsAda: false,
        AllowWebBooking: true,
        MapInfo: {
          UnitImage: "",
          UnitImageVBT: "",
          ImageCoordinateX: 0,
          ImageCoordinateY: 0,
          ImageWidth: 0,
          ImageHeight: 0,
          FontSize: 0,
          Latitude: 0,
          Longitude: 0,
        },
        IsWebViewable: true,
        IsFiltered: false,
        UnitCategoryId: 1,
        SleepingUnitIds: [83],
        UnitTypeGroupId: 1,
        UnitTypeId: 1,
        UseType: 1,
        VehicleLength: 0,
        OrderBy: 1,
        SliceCount: 31,
        AvailableCount: 1,
        IsFavourite: false,
        Slices: {
          "2024-03-20T00:00:00": {
            Date: "2024-03-20",
            IsFree: true,
            IsBlocked: false,
            IsWalkin: false,
            ReservationId: 0,
            Lock: null,
            MinStay: 1,
            IsReservationDraw: false,
          },
          "2024-03-21T00:00:00": {
            Date: "2024-03-21",
            IsFree: false,
            IsBlocked: false,
            IsWalkin: false,
            ReservationId: 123,
            Lock: null,
            MinStay: 1,
            IsReservationDraw: false,
          },
        },
        OrderByRaw: 1,
        StartTime: null,
        EndTime: null,
      },
    },
    Latitude: 0,
    Longitude: 0,
    TimebaseMaxHours: 0,
    TimebaseMinHours: 0,
    TimebaseDuration: 0,
    IsReservationDrawActive: false,
    DrawBookingStartDate: "",
    DrawBookingEndDate: "",
    ReservationDrawDetail: null,
    WalkinCounts: null,
  },
};
