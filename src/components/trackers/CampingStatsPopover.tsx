import type { Camping, TrackingStateItem } from "@/db/schema";
import { groupBy } from "lodash";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateBadge } from "@/components/trackers/DateBadge";
import type { ReactNode } from "react";

type CampingStatsProps = {
  camping: Camping;
  stats?: TrackingStateItem;
  children: ReactNode;
};

export function CampingStatsPopover({
  camping,
  stats,
  children,
}: CampingStatsProps) {
  const groupedSites = Object.entries(groupBy(stats?.sites, "siteId"));

  return (
    <Popover>
      <PopoverTrigger className="max-w-full">{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-auto max-h-[320px]">
        <div className="flex flex-col">
          <header className="px-4 py-2 bg-background sticky top-0 z-10 border-b">
            <a href="#">{camping.name}</a>
          </header>
          <div className="p-4 flex flex-col gap-4">
            {groupedSites.length ? (
              groupedSites.map(([siteId, sites]) => {
                const siteDates = sites.map((site) => site.date);

                return (
                  <div key={siteId}>
                    <h4 className="text-sm font-bold">Site {siteId}:</h4>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                      {siteDates.map((date) => (
                        <DateBadge key={date} date={date} variant="outline" />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <span>No Free site found</span>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
