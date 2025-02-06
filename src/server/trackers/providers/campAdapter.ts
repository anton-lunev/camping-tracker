import { CampsiteData } from "../types";

export interface NotificationData {
  results: CampsiteData[];
  url: string;
  count: number;
}

export interface CampAdapter {
  findCamp(
    campId: string | { campingId: string; parkId: string },
    days: string[],
    weekDays: number[],
    start: string,
    end: string,
    handledCampSites: CampsiteData[],
  ): Promise<CampsiteData[]>;

  getNotificationData(results: CampsiteData[], campId: string): NotificationData | null;
}
