import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { formatRange, groupConsecutiveDates } from "@/lib/date";

type DateRangesProps = {
  dates: string[];
  onRemove?: (dates: Date[]) => void;
  variant?: BadgeProps["variant"];
};

export function DateRanges({ dates, onRemove, variant }: DateRangesProps) {
  if (!dates.length) return null;
  return groupConsecutiveDates(dates)?.map((dates) => {
    const formattedRange = formatRange(dates);
    return (
      <Badge
        key={formattedRange}
        variant={variant}
        className="flex items-center gap-1"
      >
        {formattedRange}
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(dates)}
            className="text-xs rounded-full hover:bg-destructive hover:text-destructive-foreground"
          >
            <X size={14} />
            <span className="sr-only">Remove {formattedRange}</span>
          </button>
        ) : null}
      </Badge>
    );
  });
}
