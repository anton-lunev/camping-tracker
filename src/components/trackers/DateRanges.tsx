import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { formatRange, groupConsecutiveDates, toDate } from "@/lib/date";

type DateRangesProps = {
  dates: string[];
  onRemove?: (dates: Date[]) => void;
  variant?: BadgeProps["variant"];
  fullRange?: boolean;
};

export function DateRanges({
  dates,
  onRemove,
  variant,
  fullRange = false,
}: DateRangesProps) {
  if (!dates.length) return null;
  const groups = fullRange ? [dates.map(toDate)] : groupConsecutiveDates(dates);
  return groups?.map((dates) => {
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
