import { format } from "date-fns";

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DATE_FORMAT = "yyyy-MM-dd";

export function formatDate(date: Date, formatStr = DATE_FORMAT) {
  return format(date, formatStr);
}

export function toDate(dateStr: string) {
  // time fixes timezone issues, it'll parse the date in local timezone
  // This should be used only on UI side for rendering
  const time = dateStr.includes("T") ? "" : "T00:00:00";
  return new Date(dateStr + time);
}

interface ParsedCampingUrl {
  provider: string;
  campingId: string;
  parkId?: string;
}

export function parseCampingUrl(campingUrl: string): ParsedCampingUrl {
  const url = new URL(campingUrl);

  if (url.hostname.includes("reservecalifornia.com")) {
    const pathParts = url.hash.split("/");
    const campingId = pathParts[pathParts.length - 1];
    const parkId = pathParts[pathParts.length - 2];
    return { provider: "reservecalifornia", parkId, campingId };
  } else if (url.hostname.includes("recreation.gov")) {
    const pathParts = url.pathname.split("/");
    const campingId = pathParts[pathParts.length - 1]; // Campground ID
    return { provider: "recreation.gov", campingId };
  } else {
    throw new Error("Unsupported provider");
  }
}
