import { Badge } from "@/components/ui/badge";
import type { Camping } from "@/db/schema";
import Image from "next/image";
import { isNil } from "lodash";
import { X } from "lucide-react";

type CampingBadgeProps = {
  camping: Camping;
  counter?: number;
  onRemove?: () => void;
};

export function CampingBadge({
  camping,
  counter,
  onRemove,
}: CampingBadgeProps) {
  return (
    <Badge key={camping.id} variant="secondary" className="flex gap-2 p-1">
      <Image
        src={
          camping.provider === "recreation"
            ? "/recreation.png"
            : "/reservecalifornia.png"
        }
        width={16}
        height={16}
        alt={
          camping.provider === "recreation"
            ? "Recreation.gov"
            : "Reserve California"
        }
      />

      <span className="mr-1 block truncate">{camping.name}</span>

      {!isNil(counter) ? (
        <Badge variant="green" className="-ml-1 min-w-[18px] px-1 py-0">
          {counter}
        </Badge>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 text-xs"
        >
          <X size={14} />
          <span className="sr-only">Remove {camping.name}</span>
        </button>
      ) : null}
    </Badge>
  );
}
