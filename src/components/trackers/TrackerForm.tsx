import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCampingData } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Trash2Icon, X } from "lucide-react";
import { parseCampingUrl } from "@/components/trackers/utils";
import type { NewTracker } from "@/db/queries/trackers";
import { DaysOfWeek } from "@/components/trackers/DaysOfWeek";
import { DateRanges } from "@/components/trackers/DateRanges";
import { formatDate, toDate } from "@/lib/date";
import type { Camping } from "@/db/schema";

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

async function getCampingDataByUrl(campingUrl: string): Promise<Camping> {
  const { provider, parkId, campingId } = parseCampingUrl(campingUrl);
  const data = await getCampingData(provider, campingId);

  return {
    id: parkId ? `${parkId}:${campingId}` : campingId,
    name: data.name,
    provider,
  };
}

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

  const [campingUrl, setCampingUrl] = useState("");
  const handleCampingUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCampingUrl(e.target.value);
  };

  const addCamping = async () => {
    try {
      const newCamping = await getCampingDataByUrl(campingUrl);

      setEditedTracker((prev) => ({
        ...prev,
        campings: [
          ...prev.campings.filter((camp) => camp.id !== newCamping.id),
          newCamping,
        ],
      }));
      setCampingUrl("");
    } catch (error) {
      console.error("Error adding camping:", error);
    }
  };

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
        <Label htmlFor="campingUrl">Camping URL</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="campingUrl"
            value={campingUrl}
            onChange={handleCampingUrlChange}
            placeholder="Insert camping url"
          />
          <Button type="button" onClick={addCamping}>
            Add
          </Button>
        </div>
      </div>

      {editedTracker.campings.length ? (
        <div>
          <Label>Campings</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {editedTracker.campings.map((camping) => (
              <Badge
                key={camping.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {camping.name}
                <button
                  type="button"
                  onClick={() => removeCamping(camping.id)}
                  className="text-xs rounded-full hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X size={14} />
                  <span className="sr-only">Remove {camping.name}</span>
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

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
              className="w-full justify-start text-left font-normal mb-2"
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

      <div>
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
      </div>

      <div>
        <Label htmlFor="active">Status</Label>
        <div className="flex items-center space-x-2 mt-1">
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
