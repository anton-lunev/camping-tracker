import { TrackingStateItem } from "@/db/schema";

export type CampsiteData = {
  date: string;
  siteId: string;
  siteName: string;
  campingId: string;
  campingName: string;
};

export interface NotificationData {
  results: CampsiteData[];
  campingName: string;
  campingUrl: string;
  campsiteUrl?: string;
  count: number;
}

export interface ProviderAdapter {
  findCamp(
    campId: string,
    days: string[],
    weekDays: number[],
    start: string,
    end: string,
    trackingState?: TrackingStateItem,
  ): Promise<CampsiteData[]>;

  getNotificationData(
    results: CampsiteData[],
    campId: string,
  ): NotificationData | null;
}
