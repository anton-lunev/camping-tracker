import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecreationAdapter } from "../adapter";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { PROVIDER_CONFIG } from "@/server/trackers/providers/recreation/config";
import { mockResponse } from "@/server/trackers/providers/recreation/__tests__/mockResponse";
import { router } from "@/server/utils/router";

const campingId = "123456";
const startDate = "2024-03-01";
const endDate = "2024-03-31";

export const restHandlers = [
  http.get(router.resolve(PROVIDER_CONFIG.API_URL, { campingId }), () => {
    return HttpResponse.json(mockResponse);
  }),
];
const server = setupServer(...restHandlers);

describe("RecreationAdapter", () => {
  const adapter = new RecreationAdapter();

  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return campsites data", async () => {
    const results = await adapter.getCampsiteData({
      campingId,
      startDate,
      endDate,
    });

    expect(results).toEqual([
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-20",
        isFree: true,
        siteId: "site1",
        siteName: "A1",
      },
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-21",
        isFree: false,
        siteId: "site1",
        siteName: "A1",
      },
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-22",
        isFree: false,
        siteId: "site1",
        siteName: "A1",
      },
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-20",
        isFree: false,
        siteId: "site2",
        siteName: "A2",
      },
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-21",
        isFree: true,
        siteId: "site2",
        siteName: "A2",
      },
      {
        campingId: "123456",
        campingName: "Loop A",
        date: "2024-03-22",
        isFree: true,
        siteId: "site2",
        siteName: "A2",
      },
    ]);
  });
});
