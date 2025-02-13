import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { DATE_FORMAT_SHORT, formatDate, toDate } from "@/lib/date";

type DateBadgeProps = {
  date: string;
  variant?: BadgeProps["variant"];
};

export function DateBadge({ date, variant }: DateBadgeProps) {
  const formattedDate = formatDate(toDate(date), DATE_FORMAT_SHORT);
  return (
    <Badge
      key={formattedDate}
      variant={variant}
      className="flex items-center gap-1"
    >
      {formattedDate}
    </Badge>
  );
}
