import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WEEK_DAYS } from "@/lib/date";
import { DateRanges } from "@/components/trackers/DateRanges";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import type { Tracker } from "@/db/schema";
import { CampingBadge } from "@/components/trackers/CampingBadge";

function getStats(tracker: Tracker, campingId: string) {
  return tracker.trackingState[campingId] ?? null;
}

interface CampingTrackerCardProps {
  tracker: Tracker;
  onEdit: (id: string) => void;
  toggleActive: (tracker: Tracker) => void;
}

function CampingTrackerCard({
  tracker,
  onEdit,
  toggleActive,
}: CampingTrackerCardProps) {
  return (
    <Card
      key={tracker.id}
      className="w-full flex flex-col md:min-w-[300px] md:max-w-[350px]"
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(tracker.id)}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <div>
            <span className="font-semibold mb-2">Campings:</span>
            <div className="flex flex-wrap gap-2">
              {tracker.campings.map((camping) => (
                <CampingBadge
                  key={camping.id}
                  camping={camping}
                  stats={getStats(tracker, camping.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold mb-2">Tracking Period:</span>
            <div className="flex gap-2">
              <DateRanges dates={[tracker.startDate, tracker.endDate]} />
            </div>
          </div>

          {tracker.weekDays?.length || tracker.days?.length ? (
            <div>
              <span className="font-semibold mb-2">Tracking Days:</span>
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
        </div>
      </CardContent>
    </Card>
  );
}

interface CampingTrackerCardsProps {
  trackers: Tracker[];
  onEdit: (id: string) => void;
  toggleActive: (tracker: Tracker) => void;
}

export function CampingTrackerCards({
  trackers,
  onEdit,
  toggleActive,
}: CampingTrackerCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => (
        <CampingTrackerCard
          key={tracker.id}
          tracker={tracker}
          onEdit={onEdit}
          toggleActive={toggleActive}
        />
      ))}
    </div>
  );
}
