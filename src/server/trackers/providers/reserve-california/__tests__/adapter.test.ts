import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReserveCaliforniaAdapter } from "../adapter";
import { mockResponse } from "./mockResponse";
import { http, HttpResponse } from "msw";
import { PROVIDER_CONFIG } from "../config";
import { setupServer } from "msw/node";

export const restHandlers = [
  http.post(PROVIDER_CONFIG.API_URL, () => {
    return HttpResponse.json(mockResponse);
  }),
];
const server = setupServer(...restHandlers);

describe("ReserveCaliforniaAdapter", () => {
  const adapter = new ReserveCaliforniaAdapter();
  const campingId = `${123}:${456}`;
  const startDate = "2024-03-01";
  const endDate = "2024-03-31";

  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find available campsites on specific days", async () => {
    const results = await adapter.getCampsiteData({
      campingId,
      startDate,
      endDate,
    });

    expect(results).toEqual([
      {
        campingId: "456",
        campingName: "Test Campground",
        date: "2024-03-20",
        isFree: true,
        siteId: "1",
        siteName: "001",
      },
      {
        campingId: "456",
        campingName: "Test Campground",
        date: "2024-03-21",
        isFree: false,
        siteId: "1",
        siteName: "001",
      },
    ]);
  });
});
