import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WEEK_DAYS } from "@/lib/date";
import { DateRanges } from "@/components/trackers/DateRanges";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import type { Tracker, TrackingStateItem } from "@/db/schema";
import { CampingBadge } from "@/components/trackers/CampingBadge";
import { CampingStatsPopover } from "@/components/trackers/CampingStatsPopover";
import { RefreshButton } from "@/components/trackers/RefreshButton";

function getStats(
  tracker: Tracker,
  campingId: string,
): TrackingStateItem | undefined {
  return tracker.trackingState[campingId];
}

type CampingTrackerCardProps = {
  tracker: Tracker;
  onEdit: (id: string) => void;
  onRefresh: (tracker: Tracker) => void;
  toggleActive: (tracker: Tracker) => void;
};

function CampingTrackerCard({
  tracker,
  onEdit,
  onRefresh,
  toggleActive,
}: CampingTrackerCardProps) {
  return (
    <Card
      key={tracker.id}
      className="bg-card/20 flex w-full flex-col backdrop-blur-xs transition-colors hover:border-gray-700 md:max-w-[350px] md:min-w-[300px]"
    >
      <CardHeader>
        <div className="flex items-center justify-center">
          <Button
            className="cursor-pointer"
            variant="unstyled"
            onClick={() => toggleActive(tracker)}
          >
            <Badge variant={tracker.active ? "green" : "secondary"}>
              {tracker.active ? "Active" : "Inactive"}
            </Badge>
          </Button>

          <div className="ml-auto flex gap-1">
            {tracker.active ? (
              <RefreshButton onClick={() => onRefresh(tracker)} />
            ) : null}

            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => onEdit(tracker.id)}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div>
          <div className="mb-0.5 font-semibold">Campings:</div>
          <div className="flex flex-wrap gap-2">
            {tracker.campings.map((camping) => {
              const stats = getStats(tracker, camping.id);
              return (
                <CampingStatsPopover
                  key={camping.id}
                  camping={camping}
                  stats={stats}
                  isActive={tracker.active}
                >
                  <CampingBadge
                    camping={camping}
                    counter={stats?.sites.length}
                  />
                </CampingStatsPopover>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-0.5 font-semibold">Tracking Period:</div>
          <div className="flex gap-2">
            <DateRanges
              dates={[tracker.startDate, tracker.endDate]}
              fullRange
            />
          </div>
        </div>

        {tracker.weekDays?.length || tracker.days?.length ? (
          <div>
            <div className="mb-0.5 font-semibold">Tracking Days:</div>
            <div className="flex flex-wrap gap-2">
              {tracker?.weekDays.map((day) => (
                <Badge variant="secondary" key={day}>
                  {WEEK_DAYS[day]}
                </Badge>
              ))}
              {tracker.days?.length ? (
                <DateRanges variant="secondary" dates={tracker.days} />
              ) : null}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type CampingTrackerCardsProps = {
  trackers: Tracker[];
} & Omit<CampingTrackerCardProps, "tracker">;

export function CampingTrackerCards({
  trackers,
  ...props
}: CampingTrackerCardsProps) {
  return (
    <div className="grid gap-6 pb-6 md:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => (
        <CampingTrackerCard key={tracker.id} tracker={tracker} {...props} />
      ))}
    </div>
  );
}
