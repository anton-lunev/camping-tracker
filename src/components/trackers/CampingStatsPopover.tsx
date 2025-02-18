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
import { ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <Popover>
      <PopoverTrigger className="max-w-full">{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-auto max-h-[320px]">
        <div className="flex flex-col">
          <header className="px-4 py-2 bg-background sticky top-0 z-10 border-b">
            <a
              target="_blank"
              href={getCampingUrl(camping.provider, camping.id)}
            >
              {stats?.sites.length ? (
                <Badge
                  variant="green"
                  className="px-1 py-0 min-w-[18px] mr-1 inline-block align-text-bottom"
                >
                  {stats?.sites.length}
                </Badge>
              ) : null}
              <span className="hover:underline">{camping.name}</span>
              <ExternalLinkIcon className="size-3 inline-block ml-2" />
            </a>
          </header>
          <div className="p-4 flex flex-col gap-4">
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

                    <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                      {siteDates.map((date) => (
                        <DateBadge key={date} date={date} variant="outline" />
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
