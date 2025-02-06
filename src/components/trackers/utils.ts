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
