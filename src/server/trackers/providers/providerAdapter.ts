export type CampsiteData = {
  date: string;
  day?: number | null;
  site: string;
  siteName: string;
  campsite: string;
  campsiteId: string;
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
    campId: string | { campingId: string; parkId: string },
    days: string[],
    weekDays: number[],
    start: string,
    end: string,
    handledCampSites: CampsiteData[],
  ): Promise<CampsiteData[]>;

  getNotificationData(
    results: CampsiteData[],
    campId: string,
  ): NotificationData | null;
}
