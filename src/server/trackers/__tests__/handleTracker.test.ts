import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleTracker } from "../handleTracker";
import { findCampsAndNotify } from "../findCampsAndNotify";
import { updateTrackerDb } from "@/db/queries/trackers";
import type { Tracker } from "@/db/schema";
import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";

vi.mock("../findCampsAndNotify", () => ({
  findCampsAndNotify: vi.fn(),
}));
vi.mock("@/db/queries/trackers", () => ({
  updateTrackerDb: vi.fn(),
}));
vi.mock("@/server/trackers/providers/providerAdapterFactory", () => ({
  getProviderFromString: vi.fn((p: string) => p),
  CampProvider: {
    RECREATION: "recreation",
    RESERVE_CALIFORNIA: "reservecalifornia",
  },
  ProviderAdapterFactory: { getAdapter: vi.fn(), registerAdapter: vi.fn() },
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
vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn().mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        id: "user1",
        privateMetadata: { telegramId: 12345 },
      }),
    },
  }),
}));

const spotsForCamping = (campingId: string): CampsiteData[] => [
  {
    campingId,
    campingName: "Camp " + campingId,
    date: "2024-03-20",
    isFree: true,
    siteId: "S1",
    siteName: "Site 1",
  },
];

function makeTracker(overrides: Partial<Tracker> = {}): Tracker {
  return {
    id: "tracker-1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    campings: [
      { id: "camp-A", name: "Camp A", provider: "recreation" },
      { id: "camp-B", name: "Camp B", provider: "recreation" },
    ],
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    weekDays: [],
    days: [],
    active: true,
    interval: 60,
    owner: "user1",
    trackingState: {},
    ...overrides,
  } as Tracker;
}

describe("handleTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateTrackerDb).mockResolvedValue([]);
  });

  it("should update tracking state for all campings on success", async () => {
    vi.mocked(findCampsAndNotify)
      .mockResolvedValueOnce(spotsForCamping("camp-A"))
      .mockResolvedValueOnce(spotsForCamping("camp-B"));

    await handleTracker(makeTracker());

    expect(updateTrackerDb).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(updateTrackerDb).mock.calls[0][0];
    expect(saved.trackingState["camp-A"]).toEqual({
      campingId: "camp-A",
      sites: [
        { date: "2024-03-20", siteId: "S1", siteName: "Site 1", isFree: true },
      ],
    });
    expect(saved.trackingState["camp-B"]).toEqual({
      campingId: "camp-B",
      sites: [
        { date: "2024-03-20", siteId: "S1", siteName: "Site 1", isFree: true },
      ],
    });
  });

  it("should preserve existing state for failed camping and update successful one", async () => {
    const existingState = {
      "camp-A": {
        campingId: "camp-A",
        sites: [
          {
            date: "2024-03-19",
            siteId: "S9",
            siteName: "Old Site",
            isFree: true,
          },
        ],
      },
    };

    vi.mocked(findCampsAndNotify)
      .mockResolvedValueOnce(undefined) // camp-A fails
      .mockResolvedValueOnce(spotsForCamping("camp-B")); // camp-B succeeds

    await handleTracker(makeTracker({ trackingState: existingState }));

    expect(updateTrackerDb).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(updateTrackerDb).mock.calls[0][0];
    // camp-A state preserved from before
    expect(saved.trackingState["camp-A"]).toEqual(existingState["camp-A"]);
    // camp-B state updated
    expect(saved.trackingState["camp-B"]).toEqual({
      campingId: "camp-B",
      sites: [
        { date: "2024-03-20", siteId: "S1", siteName: "Site 1", isFree: true },
      ],
    });
  });

  it("should not call updateTrackerDb when all campings fail", async () => {
    const existingState = {
      "camp-A": {
        campingId: "camp-A",
        sites: [
          {
            date: "2024-03-19",
            siteId: "S9",
            siteName: "Old Site",
            isFree: true,
          },
        ],
      },
    };

    vi.mocked(findCampsAndNotify)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);

    await handleTracker(makeTracker({ trackingState: existingState }));

    expect(updateTrackerDb).not.toHaveBeenCalled();
  });

  it("should handle single camping success while other fails", async () => {
    const tracker = makeTracker({
      campings: [
        { id: "camp-A", name: "Camp A", provider: "recreation" },
        { id: "camp-B", name: "Camp B", provider: "recreation" },
        { id: "camp-C", name: "Camp C", provider: "recreation" },
      ],
      trackingState: {
        "camp-B": {
          campingId: "camp-B",
          sites: [
            {
              date: "2024-03-18",
              siteId: "S5",
              siteName: "Prev",
              isFree: true,
            },
          ],
        },
      },
    });

    vi.mocked(findCampsAndNotify)
      .mockResolvedValueOnce(undefined) // camp-A fails
      .mockResolvedValueOnce(undefined) // camp-B fails
      .mockResolvedValueOnce(spotsForCamping("camp-C")); // camp-C succeeds

    await handleTracker(tracker);

    expect(updateTrackerDb).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(updateTrackerDb).mock.calls[0][0];
    // camp-A had no prior state, still absent
    expect(saved.trackingState["camp-A"]).toBeUndefined();
    // camp-B state preserved
    expect(saved.trackingState["camp-B"]).toEqual(
      tracker.trackingState["camp-B"],
    );
    // camp-C state updated
    expect(saved.trackingState["camp-C"].campingId).toBe("camp-C");
    expect(saved.trackingState["camp-C"].sites).toHaveLength(1);
  });
});
