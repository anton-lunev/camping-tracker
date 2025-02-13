import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { Camping, TrackingStateItem } from "@/db/schema";
import { groupBy } from "lodash";
import { DateBadge } from "@/components/trackers/DateBadge";

type CampingBadgeProps = {
  camping: Camping;
  stats?: TrackingStateItem;
};

export function CampingBadge({ camping, stats }: CampingBadgeProps) {
  const groupedSites = Object.entries(groupBy(stats?.sites, "siteId"));

  return (
    <Popover>
      <PopoverTrigger className="max-w-full">
        <Badge key={camping.id} variant="secondary" className="flex gap-2">
          <span className="block truncate">{camping.name}</span>

          {stats?.sites ? (
            <Badge variant="green" className="px-1 -mr-2">
              {stats.sites.length}
            </Badge>
          ) : null}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-auto max-h-[300px]">
        <div className="flex flex-col">
          <h3 className="px-4 py-2 text-lg font-semibold bg-background sticky top-0 z-10 border-b">
            Free Sites
          </h3>
          <div className="p-4">
            {groupedSites.length ? (
              groupedSites.map(([siteId, sites]) => {
                const siteDates = sites.map((site) => site.date);

                return (
                  <div key={siteId} className="mb-4">
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
