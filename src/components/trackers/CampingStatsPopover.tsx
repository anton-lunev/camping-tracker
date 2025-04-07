import type { Camping, TrackingStateItem } from "@/db/schema";
import { groupBy } from "lodash";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateBadge } from "@/components/trackers/DateBadge";
import type { ReactNode } from "react";
import {
  getCampingUrl,
  getCampsiteUrl,
} from "@/components/trackers/providerUrlResolver";
import { CalendarIcon, ExternalLinkIcon, ListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATE_FORMAT_SHORT, formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CampingStatsProps = {
  camping: Camping;
  stats?: TrackingStateItem;
  isActive?: boolean;
  children: ReactNode;
};

export function CampingStatsPopover({
  camping,
  stats,
  isActive,
  children,
}: CampingStatsProps) {
  const groupedSites = Object.entries(groupBy(stats?.sites, "siteId"));

  // Create a map of dates to site counts for the calendar
  const siteDateMap = new Map<
    string,
    { count: number; sites: Array<{ siteId: string; siteName: string }> }
  >();
  stats?.sites.forEach((site) => {
    const dateStr = site.date;
    if (!siteDateMap.has(dateStr)) {
      siteDateMap.set(dateStr, { count: 0, sites: [] });
    }
    const dateData = siteDateMap.get(dateStr)!;
    // Only count each site once per date
    if (!dateData.sites.some((s) => s.siteId === site.siteId)) {
      dateData.count++;
      dateData.sites.push({ siteId: site.siteId, siteName: site.siteName });
    }
  });

  return (
    <Popover>
      <PopoverTrigger className="max-w-full cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[360px] w-80 overflow-auto p-0"
        side="bottom"
      >
        <div className="flex flex-col">
          <header className="bg-background sticky top-0 z-10 border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <a
                target="_blank"
                href={getCampingUrl(camping.provider, camping.id)}
              >
                {stats?.sites.length ? (
                  <Badge
                    variant="green"
                    className="mr-1 inline-block min-w-[18px] px-1 py-0 align-text-bottom"
                  >
                    {stats?.sites.length}
                  </Badge>
                ) : null}
                <span className="hover:underline">{camping.name}</span>
                <ExternalLinkIcon className="ml-2 inline-block size-3" />
              </a>
            </div>
          </header>

          <Tabs defaultValue="list" className="mt-2 w-full">
            <div className="flex w-full px-4">
              <TabsList className="m-auto h-7">
                <TabsTrigger value="list" className="h-7 px-2">
                  <ListIcon className="size-4" />
                  <span className="ml-1">List</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="h-7 px-2">
                  <CalendarIcon className="size-4" />
                  <span className="ml-1">Calendar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="m-0">
              <div className="flex flex-col gap-4 p-4">
                {groupedSites.length ? (
                  groupedSites.map(([siteId, sites]) => {
                    const siteDates = sites.map((site) => site.date);
                    const siteUrl = getCampsiteUrl(camping.provider, siteId);
                    return (
                      <div key={siteId}>
                        {siteUrl ? (
                          <a
                            target="_blank"
                            href={siteUrl}
                            className="text-sm font-bold hover:underline"
                          >
                            Site {sites[0].siteName}:
                          </a>
                        ) : (
                          <h4 className="text-sm font-bold">
                            Site {sites[0].siteName}:
                          </h4>
                        )}

                        <div className="text-muted-foreground flex flex-wrap gap-1 text-sm">
                          {siteDates.map((date) => (
                            <DateBadge
                              key={date}
                              date={date}
                              variant="outline"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span>
                    {isActive
                      ? "No Free site found"
                      : "Activate tracker to see free spots"}
                  </span>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="calendar"
              className="flex items-center justify-center"
            >
              <div className="w-fit">
                <TooltipProvider>
                  <Calendar
                    mode="single"
                    selected={undefined}
                    components={{
                      Day: ({ day, ...dayProps }) => {
                        const dateStr = formatDate(day.date);
                        const dateStats = siteDateMap.get(dateStr);
                        const hasAvailability = !!dateStats?.count;

                        if (!hasAvailability) {
                          return (
                            <td
                              {...dayProps}
                              className="h-9 w-9 text-center align-middle"
                            >
                              {day.date.getDate()}
                            </td>
                          );
                        }

                        return (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <td
                                {...dayProps}
                                className={cn(
                                  "text-foreground hover:bg-primary relative size-9 cursor-pointer rounded-md text-center font-bold",
                                )}
                              >
                                <span>{day.date.getDate()}</span>
                                <div className="absolute right-0 bottom-1 left-0 flex justify-center gap-0.5">
                                  {Array(Math.min(dateStats.count, 3))
                                    .fill(0)
                                    .map((_, i) => (
                                      <span
                                        key={i}
                                        className="inline-block size-1 rounded-full bg-emerald-500"
                                      />
                                    ))}
                                  {dateStats.count > 3 && (
                                    <span className="inline-block size-1 rounded-full bg-emerald-500" />
                                  )}
                                </div>
                              </td>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <div className="max-w-[200px]">
                                <div className="mb-1">
                                  {formatDate(day.date, DATE_FORMAT_SHORT)} -{" "}
                                  {dateStats.count} sites
                                </div>
                                <div className="max-h-[100px] overflow-auto text-xs">
                                  {dateStats.sites.map((site) => (
                                    <div key={site.siteId}>
                                      Site {site.siteName}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      },
                    }}
                  />
                </TooltipProvider>
                {!siteDateMap.size && (
                  <div className="text-muted-foreground p-4 text-center">
                    {isActive
                      ? "No Free site found"
                      : "Activate tracker to see free spots"}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}
