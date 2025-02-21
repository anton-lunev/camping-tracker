import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type { NewTracker } from "@/db/queries/trackers";
import { DaysOfWeek } from "@/components/trackers/DaysOfWeek";
import { DateRanges } from "@/components/trackers/DateRanges";
import { formatDate, toDate } from "@/lib/date";
import type { Camping } from "@/db/schema";
import { CampingBadge } from "@/components/trackers/CampingBadge";
import { AddCampingPopoverContent } from "./AddCampingPopoverContent";

interface TrackerFormProps<T extends NewTracker> {
  tracker?: T;
  onSave: (tracker: T) => void;
  onRemove?: (tracker: T) => void;
  onCancel: () => void;
}

const defaultTracker: Omit<NewTracker, "owner"> = {
  campings: [],
  startDate: formatDate(new Date()),
  endDate: formatDate(new Date()),
  weekDays: [],
  days: [],
  active: true,
  interval: 60,
};

export function TrackerForm<T extends NewTracker>({
  tracker,
  onSave,
  onRemove,
  onCancel,
}: TrackerFormProps<T>) {
  const [editedTracker, setEditedTracker] = useState<T>(
    tracker ?? (defaultTracker as T),
  );

  useEffect(() => {
    setEditedTracker(tracker ?? (defaultTracker as T));
  }, [tracker]);

  const removeCamping = (campingId: string) => {
    setEditedTracker((prev) => ({
      ...prev,
      campings: prev.campings.filter((camping) => camping.id !== campingId),
    }));
  };

  const handleDaysChange = (dates: Date[] | undefined = []) => {
    setEditedTracker((prev) => ({
      ...prev,
      days: dates?.map((date) => formatDate(date)).sort(),
    }));
  };

  const removeDays = (daysToRemove: Date[]) => {
    const formattedDatesToRemove = new Set(
      daysToRemove.map((date) => formatDate(date)),
    );
    setEditedTracker((prev) => ({
      ...prev,
      days: prev.days?.filter((day) => !formattedDatesToRemove.has(day)),
    }));
  };

  const handleWeekDaysChange = (day: number) => {
    setEditedTracker((prev) => ({
      ...prev,
      weekDays: prev.weekDays?.includes(day)
        ? prev.weekDays?.filter((d) => d !== day)
        : [...(prev.weekDays ?? []), day],
    }));
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "startDate" | "endDate",
  ) => {
    if (date) {
      setEditedTracker((prev) => ({
        ...prev,
        [field]: formatDate(date),
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(editedTracker);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Campings</Label>
        {editedTracker.campings.length ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {editedTracker.campings.map((camping) => (
              <CampingBadge
                key={camping.id}
                camping={camping}
                onRemove={() => removeCamping(camping.id)}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start" side="right">
              <AddCampingPopoverContent
                onCampingAdd={(newCamping: Camping) => {
                  setEditedTracker((prev) => ({
                    ...prev,
                    campings: [
                      ...prev.campings.filter(
                        (camp) => camp.id !== newCamping.id,
                      ),
                      newCamping,
                    ],
                  }));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {editedTracker.startDate
                  ? formatDate(toDate(editedTracker.startDate), "PP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(editedTracker.startDate)}
                onSelect={(date) => handleDateChange(date, "startDate")}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {editedTracker.endDate
                  ? formatDate(toDate(editedTracker.endDate), "PP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(editedTracker.endDate)}
                onSelect={(date) => handleDateChange(date, "endDate")}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label className="mb-1">Week Days</Label>
        <DaysOfWeek
          selection={editedTracker.weekDays}
          onChange={handleWeekDaysChange}
        />
      </div>

      <div>
        <Label htmlFor="specific-days">Specific Days</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="specific-days"
              variant="outline"
              className="mb-2 w-full justify-start text-left font-normal"
            >
              Select days
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="multiple"
              selected={editedTracker.days?.map((day) => toDate(day))}
              onSelect={handleDaysChange}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2">
          <DateRanges
            dates={editedTracker.days}
            onRemove={removeDays}
            variant="secondary"
          />
        </div>
      </div>

      {/* TODO: add support of custom intervals */}
      {/*<div>
        <Label htmlFor="interval">Check Interval (sec)</Label>
        <Input
          id="interval"
          name="interval"
          type="number"
          min="30"
          value={editedTracker.interval}
          onChange={(e) =>
            setEditedTracker((prev) => ({
              ...prev,
              interval: parseInt(e.target.value, 10),
            }))
          }
        />
      </div>*/}

      <div>
        <Label htmlFor="active">Status</Label>
        <div className="mt-1 flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={editedTracker.active}
            onCheckedChange={(checked) =>
              setEditedTracker((prev) => ({
                ...prev,
                active: checked as boolean,
              }))
            }
          />
          <label htmlFor="active">Active</label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onRemove ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onRemove(editedTracker);
            }}
            size="icon"
            className="mr-auto"
          >
            <Trash2Icon />
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
