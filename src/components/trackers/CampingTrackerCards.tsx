import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, toDate, WEEK_DAYS } from "@/components/trackers/utils";
import { Tracker } from "@/db/queries/trackers";

interface CampingTrackerCardsProps {
  trackers: Tracker[];
  onEdit: (id: string) => void;
}

export default function CampingTrackerCards({
  trackers,
  onEdit,
}: CampingTrackerCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trackers.map((tracker) => (
        <Card key={tracker.id} className="w-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between gap-2">
              <Badge variant={tracker.active ? "default" : "secondary"}>
                {tracker.active ? "Active" : "Inactive"}
              </Badge>
              <p className="text-sm text-muted-foreground font-light">
                Created: {formatDate(toDate(tracker.createdAt), "PPP")}
              </p>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 gap-4">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Campings:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tracker.campings.map((camping) => (
                    <Badge key={camping.id} variant="secondary">
                      {camping.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">Date Range:</span>
                <p>
                  {[tracker.startDate, tracker.endDate]
                    .map((date) => formatDate(toDate(date), "PP"))
                    .join(" - ")}
                </p>
              </div>

              {tracker.weekDays?.length ? (
                <div>
                  <span className="font-semibold">Week Days:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tracker.weekDays?.map((day) => (
                      <Badge key={day} variant="outline">
                        {WEEK_DAYS[day]}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {tracker.days?.length ? (
                <div>
                  <span className="font-semibold">Tracked Days:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tracker.days?.map((day) => (
                      <Badge key={day}>{formatDate(toDate(day), "PP")}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Button
              className="mt-auto w-full"
              variant="outline"
              onClick={() => onEdit(tracker.id)}
            >
              Edit Tracker
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
