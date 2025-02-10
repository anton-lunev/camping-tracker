import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { Camping, TrackingStateItem } from "@/db/schema";
import { groupBy } from "lodash";
import { DateRanges } from "@/components/trackers/DateRanges";

type CampingBadgeProps = {
  camping: Camping;
  stats?: TrackingStateItem;
};

export function CampingBadge({ camping, stats }: CampingBadgeProps) {
  const groupedSites = Object.entries(groupBy(stats?.sites, "siteId"));
  console.log(groupedSites);
  return (
    <Popover>
      <PopoverTrigger>
        <Badge key={camping.id} variant="secondary" className="flex gap-2">
          <span>{camping.name}</span>

          {stats?.sites ? (
            <Badge
              variant="default"
              className="px-1 -mr-2 bg-emerald-600 hover:bg-emerald-700"
            >
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
            {groupedSites.map(([siteId, sites]) => {
              const siteDates = sites.map((site) => site.date);

              return (
                <div key={siteId} className="mb-4">
                  <h4 className="text-sm font-bold">Site {siteId}:</h4>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                    <DateRanges dates={siteDates} variant="outline" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
