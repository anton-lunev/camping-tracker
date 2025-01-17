const DAYS_OF_WEEK = [
  "Sunday", // Corrected for JavaScript's getDay() method.
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type CampsiteData = {
  date: string;
  day: string | null;
  site: string;
  campsite: string;
  campsiteId: string;
};
export type CampsitesResponse = {
  campsites: Record<
    string,
    {
      site: string;
      loop: string;
      campsite_id: string;
      availabilities: Record<string, string>;
    }
  >;
};

/**
 * Returns the day of the week for a given date.
 */
export function getDayOfWeek(date: string): string | null {
  const dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null : DAYS_OF_WEEK[dayOfWeek];
}

/**
 * Filters camp data based on specific weekdays.
 */
export function filterByWeekDay(
  campData: CampsiteData,
  weekDays: string[],
): CampsiteData | null {
  return weekDays.length
    ? campData.day && weekDays.includes(campData.day)
      ? campData
      : null
    : campData;
}

/**
 * Filters out campsites already found in the past.
 */
export function keepOnlyNew(
  alreadyFoundCampSites: CampsiteData[],
  campData: CampsiteData,
): boolean {
  return !alreadyFoundCampSites.find(
    (camp) => campData.date === camp.date && campData.site === camp.site,
  );
}

/**
 * Filters camp data based on specific dates.
 */
export function filterCertainDays(campData: CampsiteData, days: string[]) {
  if (!days.length) return campData;
  const daysFormatted = days.map((day) =>
    new Date(`${day}T00:00:00`).toDateString(),
  );
  return daysFormatted.includes(new Date(campData.date).toDateString())
    ? campData
    : null;
}

/**
 * Extracts all available sites from the API response.
 */
export function findAvailablePlaces(
  response: CampsitesResponse,
): CampsiteData[] {
  const available: CampsiteData[] = [];
  const { campsites } = response;

  for (const campsiteId in campsites) {
    const campsite = campsites[campsiteId];
    for (const [date, value] of Object.entries(campsite.availabilities)) {
      if (value === "Available") {
        available.push({
          date,
          day: getDayOfWeek(date),
          site: campsite.site,
          campsite: campsite.loop,
          campsiteId: campsite.campsite_id,
        });
      }
    }
  }
  return available;
}
