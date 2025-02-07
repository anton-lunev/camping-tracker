import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecreationAdapter } from "../adapter";
import { mockResponse } from "./mockResponse";
import { getTrackingStateItem } from "@/server/trackers/utils";

// Mock fetch
const global = globalThis;
global.fetch = vi.fn();

describe("RecreationAdapter", () => {
  const adapter = new RecreationAdapter();
  const mockCampId = "123456";
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
      campingId: "site1",
      campingName: "Loop A",
      siteId: "A1",
      siteName: "A1",
    });
  });

  it("should find available campsites on specific weekdays", async () => {
    const results = await adapter.findCamp(
      mockCampId,
      [], // Any day
      [4], // Only Thursdays
      mockStartDate,
      mockEndDate,
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      date: "2024-03-21",
      campingId: "site2",
      campingName: "Loop A",
      siteId: "A2",
      siteName: "A2",
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
