import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import { Camping, getCampingData, NewTracker } from "./actions";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  formatDate,
  parseCampingUrl,
  toDate,
  WEEK_DAYS,
} from "@/components/trackers/utils";

interface TrackerFormProps<T extends NewTracker> {
  tracker?: T;
  onSave: (tracker: T) => void;
  onCancel: () => void;
}

const defaultTracker: NewTracker = {
  campings: [],
  start_date: formatDate(new Date()),
  end_date: formatDate(new Date()),
  week_days: [],
  days: [],
  active: true,
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

export default function TrackerForm<T extends NewTracker>({
  tracker,
  onSave,
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

  const handleDaysChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDate(date);
      setEditedTracker((prev) => ({
        ...prev,
        days: prev.days?.includes(formattedDate)
          ? prev.days?.filter((d) => d !== formattedDate)
          : [...(prev.days ?? []), formattedDate].sort(),
      }));
    }
  };

  const removeDay = (dayToRemove: string) => {
    setEditedTracker((prev) => ({
      ...prev,
      days: prev.days?.filter((day) => day !== dayToRemove),
    }));
  };

  const handleWeekDaysChange = (day: number) => {
    setEditedTracker((prev) => ({
      ...prev,
      week_days: prev.week_days?.includes(day)
        ? prev.week_days?.filter((d) => d !== day)
        : [...(prev.week_days ?? []), day],
    }));
  };

  const handleDateChange = (
    date: Date | undefined,
    field: "start_date" | "end_date",
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
                {editedTracker.start_date
                  ? formatDate(toDate(editedTracker.start_date), "PP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(editedTracker.start_date)}
                onSelect={(date) => handleDateChange(date, "start_date")}
                initialFocus
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
                {editedTracker.end_date
                  ? formatDate(toDate(editedTracker.end_date), "PP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(editedTracker.end_date)}
                onSelect={(date) => handleDateChange(date, "end_date")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="tracked-days">Tracked Days</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="tracked-days"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              Select days
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="multiple"
              selected={editedTracker.days?.map((day) => toDate(day))}
              onSelect={(dates) => {
                if (dates && dates.length > 0) {
                  const lastSelectedDate = dates[dates.length - 1];
                  handleDaysChange(lastSelectedDate);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {editedTracker.days?.map((day) => (
            <Badge
              key={day}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {formatDate(toDate(day), "PP")}
              <button
                type="button"
                onClick={() => removeDay(day)}
                className="text-xs rounded-full hover:bg-destructive hover:text-destructive-foreground"
              >
                <X size={14} />
                <span className="sr-only">
                  Remove {formatDate(toDate(day), "PP")}
                </span>
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Week Days</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {WEEK_DAYS.map((day, index) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${index}`}
                checked={editedTracker.week_days?.includes(index)}
                onCheckedChange={() => handleWeekDaysChange(index)}
              />
              <label htmlFor={`day-${index}`}>{day}</label>
            </div>
          ))}
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
