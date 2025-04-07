import { describe, expect, it } from "vitest";
import {
  applyFilters,
  filterByWeekDay,
  filterCertainDays,
  filterFreeSpots,
  keepOnlyNew,
} from "@/server/trackers/common/filters";
import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import type { TrackingStateItem } from "@/db/schema";

// Sample data as provided
const sampleData: CampsiteData[] = [
  {
    campingId: "site1",
    campingName: "Loop A",
    date: "2024-03-20",
    isFree: true,
    siteId: "A1",
    siteName: "A1",
  },
  {
    campingId: "site1",
    campingName: "Loop A",
    date: "2024-03-21",
    isFree: false,
    siteId: "A1",
    siteName: "A1",
  },
  {
    campingId: "site1",
    campingName: "Loop A",
    date: "2024-03-22",
    isFree: false,
    siteId: "A1",
    siteName: "A1",
  },
  {
    campingId: "site2",
    campingName: "Loop A",
    date: "2024-03-20",
    isFree: false,
    siteId: "A2",
    siteName: "A2",
  },
  {
    campingId: "site2",
    campingName: "Loop A",
    date: "2024-03-21",
    isFree: true,
    siteId: "A2",
    siteName: "A2",
  },
  {
    campingId: "site2",
    campingName: "Loop A",
    date: "2024-03-22",
    isFree: true,
    siteId: "A2",
    siteName: "A2",
  },
];

describe("filterFreeSpots", () => {
  it("should return true if campsite is free", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // Free campsite
    expect(filterFreeSpots(campData)).toBe(true);
  });

  it("should return false if campsite is not free", () => {
    const campData: CampsiteData = { ...sampleData[1] }; // Not free campsite
    expect(filterFreeSpots(campData)).toBe(false);
  });
});

describe("filterByWeekDay", () => {
  it("should return true if no weekdays are provided (ignore filter)", () => {
    const campData: CampsiteData = { ...sampleData[0] };
    expect(filterByWeekDay(campData, [])).toBe(true);
  });

  it("should return true if weekday is included in the filter", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20 is Wednesday (weekday 3)
    expect(filterByWeekDay(campData, [3])).toBe(true);
  });

  it("should return false if weekday is not included in the filter", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20 is Wednesday (weekday 3)
    expect(filterByWeekDay(campData, [1, 2, 4, 5, 6])).toBe(false);
  });

  it("should return false if getDayOfWeek returns undefined", () => {
    const campData: CampsiteData = { ...sampleData[0], date: "invalid-date" };
    expect(filterByWeekDay(campData, [3])).toBe(false);
  });
});

describe("keepOnlyNew", () => {
  it("should return true if trackingState is undefined (always new)", () => {
    const campData: CampsiteData = { ...sampleData[0] };
    expect(keepOnlyNew(undefined, campData)).toBe(true);
  });

  it("should return true if campsite is not found in trackingState", () => {
    const trackingState: TrackingStateItem = {
      campingId: "tracker1",
      sites: [
        { date: "2024-03-19", siteId: "A1", siteName: "A1", isFree: true },
        { date: "2024-03-21", siteId: "A2", siteName: "A2", isFree: false },
      ],
    };
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20, A1 - not in trackingState
    expect(keepOnlyNew(trackingState, campData)).toBe(true);
  });

  it("should return false if campsite is found in trackingState", () => {
    const trackingState: TrackingStateItem = {
      campingId: "tracker1",
      sites: [
        { date: "2024-03-20", siteId: "A1", siteName: "A1", isFree: true },
      ],
    };
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20, A1 - in trackingState
    expect(keepOnlyNew(trackingState, campData)).toBe(false);
  });
});

describe("filterCertainDays", () => {
  it("should return false if no days are provided (ignore filter)", () => {
    const campData: CampsiteData = { ...sampleData[0] };
    expect(filterCertainDays(campData, [])).toBe(false);
  });

  it("should return true if date is included in the filter", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20
    expect(filterCertainDays(campData, ["2024-03-20"])).toBe(true);
  });

  it("should return false if date is not included in the filter", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20
    expect(filterCertainDays(campData, ["2024-03-21", "2024-03-22"])).toBe(
      false,
    );
  });

  it("should handle different date formats in filter days", () => {
    const campData: CampsiteData = { ...sampleData[0] }; // 2024-03-20
    expect(
      filterCertainDays(campData, ["03/20/2024", "2024-03-20T00:00:00.000Z"]),
    ).toBe(true); // Assuming getFormattedDateWithoutTz handles these formats
  });
});

describe("applyFilters", () => {
  it("should apply all filters correctly and return allSpots and newSpots", () => {
    const filters = {
      days: ["2024-03-20"], // Filter for 2024-03-20
      weekDays: [3], // Filter for Wednesday (2024-03-20)
      trackingState: {
        campingId: "tracker1",
        sites: [{ date: "2024-03-20", siteId: "A1", isFree: true }], // Already tracked site on 2024-03-20 - A1
      } as TrackingStateItem,
    };

    const { allSpots, newSpots } = applyFilters(sampleData, filters);

    expect(allSpots).toEqual([
      sampleData[0], // A1 (2024-03-20) - Free, Wednesday, Day filter matches
    ]);
    expect(newSpots).toEqual([]); // A1 (2024-03-20) - Free, Wednesday, Day filter matches, but NOT new
  });

  it("Corrected test case: should apply all filters correctly and return allSpots and newSpots for site2/A2 on 2024-03-22", () => {
    const filters = {
      days: ["2024-03-22"], // Filter for 2024-03-22
      weekDays: [5], // Filter for Friday (2024-03-22 is Friday)
      trackingState: {
        campingId: "tracker1",
        sites: [{ date: "2024-03-22", siteId: "A1", isFree: true }], // Already tracked site on 2024-03-22 - A1 (different site)
      } as TrackingStateItem,
    };

    const { allSpots, newSpots } = applyFilters(sampleData, filters);

    expect(allSpots).toEqual([
      sampleData[5], // A2 (2024-03-22) - Free, Friday, Day filter matches
    ]);
    expect(newSpots).toEqual([
      sampleData[5], // A2 (2024-03-22) - Free, Friday, Day filter matches, and IS new because A2 is not tracked, A1 is.
    ]);
  });

  it("Test case with no filters, only free spots", () => {
    const filtersNoFilters = {
      days: [],
      weekDays: [],
      trackingState: undefined,
    };
    const { allSpots: allSpotsNoFilters, newSpots: newSpotsNoFilters } =
      applyFilters(sampleData, filtersNoFilters);

    expect(allSpotsNoFilters).toEqual([
      sampleData[0], // A1 (2024-03-20) - Free
      sampleData[4], // A2 (2024-03-21) - Free
      sampleData[5], // A2 (2024-03-22) - Free
    ]);
    expect(newSpotsNoFilters).toEqual([
      sampleData[0], // A1 (2024-03-20) - Free
      sampleData[4], // A2 (2024-03-21) - Free
      sampleData[5], // A2 (2024-03-22) - Free
    ]);
  });
});
