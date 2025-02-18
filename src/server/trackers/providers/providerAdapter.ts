export type CampsiteData = {
  date: string;
  siteId: string;
  siteName: string;
  campingId: string;
  campingName: string;
  isFree: boolean;
};

export type NotificationData = {
  results: CampsiteData[];
  campingName: string;
  campingUrl: string;
  campsiteUrl?: string;
  count: number;
};

export type CampingInfo = {
  name: string;
};

export interface ProviderAdapter {
  getCampsiteData(params: {
    campingId: string;
    startDate: string;
    endDate: string;
  }): Promise<CampsiteData[]>;

  getCampingInfo(campingId: string): Promise<CampingInfo>;

  getNotificationData(
    results: CampsiteData[],
    campId: string,
  ): NotificationData | null;
}
