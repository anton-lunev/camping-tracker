export type CampsiteData = {
  date: string;
  siteId: string;
  siteName: string;
  campingId: string;
  campingName: string;
  isFree: boolean;
};

export interface NotificationData {
  results: CampsiteData[];
  campingName: string;
  campingUrl: string;
  campsiteUrl?: string;
  count: number;
}

export interface ProviderAdapter {
  getCampsiteData(params: {
    campingId: string;
    startDate: string;
    endDate: string;
  }): Promise<CampsiteData[]>;

  getNotificationData(
    results: CampsiteData[],
    campId: string,
  ): NotificationData | null;
}
