import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReserveCaliforniaAdapter } from "../adapter";
import { mockResponse } from "./mockResponse";
import { getTrackingStateItem } from "@/server/trackers/utils";

// Mock fetch
const global = globalThis;
global.fetch = vi.fn();

describe("ReserveCaliforniaAdapter", () => {
  const adapter = new ReserveCaliforniaAdapter();
  const mockParkId = "123";
  const mockCampingId = "456";
  const mockCampId = `${mockParkId}:${mockCampingId}`;
  const mockStartDate = "2024-03-01";
  const mockEndDate = "2024-03-31";

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
  });

  it("should find available campsites on specific days", async () => {
    const results = await adapter.findCamp(
      mockCampId,
      ["2024-03-20"], // Only looking for March 20
      [],
      mockStartDate,
      mockEndDate,
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      date: "2024-03-20",
      campingId: "456",
      campingName: "Test Campground",
      siteId: "1",
      siteName: "001",
    });
  });

  it("should find available campsites on specific weekdays", async () => {
    const results = await adapter.findCamp(
      mockCampId,
      [], // Any day
      [3], // Only Wednesdays
      mockStartDate,
      mockEndDate,
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      date: "2024-03-20",
      campingId: "456",
      campingName: "Test Campground",
      siteId: "1",
      siteName: "001",
    });
  });

  it("should not return already found campsites", async () => {
    // First call
    const firstResults = await adapter.findCamp(
      mockCampId,
      [],
      [],
      mockStartDate,
      mockEndDate,
    );

    // Second call should return empty array since all sites were found in first call
    const results = await adapter.findCamp(
      mockCampId,
      [],
      [],
      mockStartDate,
      mockEndDate,
      getTrackingStateItem(mockCampId, firstResults), // Pass first results as already found sites
    );

    expect(results).toHaveLength(0);
  });
});
