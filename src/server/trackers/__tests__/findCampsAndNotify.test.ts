import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import type { TrackingStateItem } from "@/db/schema";
import { postToChannel } from "@/server/trackers/messanger";
import { findCampsAndNotify, logger } from "../findCampsAndNotify";
import {
  CampProvider,
  ProviderAdapterFactory,
} from "@/server/trackers/providers/providerAdapterFactory";

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

vi.mock("@/server/trackers/providers/providerAdapterFactory");

vi.mock("@/server/trackers/messanger", () => ({
  postToChannel: vi.fn(),
  formatInfoToMessage: vi.fn((data) => `formatted-${JSON.stringify(data)}`),
}));

vi.mock("@/server/utils/logger", () => ({
  Logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    for: () => ({
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    }),
  },
}));

describe("findCampsAndNotify", () => {
  const mockAdapter = {
    getCampsiteData: vi.fn().mockResolvedValue(sampleData),
    getNotificationData: vi.fn().mockReturnValue({ some: "data" }),
  };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ProviderAdapterFactory).mockImplementation(() => ({
      getAdapter: vi.fn(),
      registerAdapter: vi.fn(),
    }));
    vi.mocked(ProviderAdapterFactory.getAdapter).mockReturnValue(mockAdapter);
    vi.mocked(postToChannel).mockResolvedValue(undefined);
  });

  it("should post notification when new spots are found", async () => {
    const trackingState: TrackingStateItem = { campingId: "site1", sites: [] };

    await findCampsAndNotify({
      provider: CampProvider.RECREATION,
      campingId: "site1",
      days: ["2024-03-20"],
      weekDays: [3],
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      trackingState,
    });

    expect(mockAdapter.getCampsiteData).toHaveBeenCalledWith({
      campingId: "site1",
      startDate: "2024-03-20",
      endDate: "2024-03-22",
    });

    expect(postToChannel).toHaveBeenCalledWith('formatted-{"some":"data"}');
  });

  it("should not post notification when no new spots exist", async () => {
    const trackingState: TrackingStateItem = {
      campingId: "site1",
      sites: [{ siteId: "A1", date: "2024-03-20", isFree: true }],
    };

    await findCampsAndNotify({
      provider: CampProvider.RECREATION,
      campingId: "site1",
      days: ["2024-03-20"],
      weekDays: [3],
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      trackingState,
    });

    expect(postToChannel).not.toHaveBeenCalled();
  });

  it("should handle errors from getCampsiteData", async () => {
    const error = new Error("API failure");
    vi.mocked(ProviderAdapterFactory.getAdapter).mockReturnValue({
      getCampsiteData: vi.fn().mockRejectedValue(error),
      getNotificationData: vi.fn().mockReturnValue({ some: "data" }),
    });

    await findCampsAndNotify({
      provider: CampProvider.RECREATION,
      campingId: "site1",
      days: [],
      weekDays: [],
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      trackingState: undefined,
    });

    expect(logger.error).toHaveBeenCalledWith(
      "Unexpected error occurred",
      expect.objectContaining({
        error: "API failure",
      }),
    );
  });

  it("should log error if postToChannel fails", async () => {
    const postError = new Error("Post failed");
    vi.mocked(postToChannel).mockRejectedValue(postError);

    await findCampsAndNotify({
      provider: CampProvider.RECREATION,
      campingId: "site1",
      days: ["2024-03-20"],
      weekDays: [3],
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      trackingState: undefined,
    });

    expect(logger.error).toHaveBeenCalledWith(
      "Failed to post notification",
      postError,
    );
  });

  it("should not post if getNotificationData returns null", async () => {
    mockAdapter.getNotificationData.mockReturnValue(null);

    await findCampsAndNotify({
      provider: CampProvider.RECREATION,
      campingId: "site1",
      days: ["2024-03-20"],
      weekDays: [3],
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      trackingState: undefined,
    });

    expect(postToChannel).not.toHaveBeenCalled();
  });
});
