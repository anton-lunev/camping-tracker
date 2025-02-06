import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { WEEK_DAYS } from "@/lib/date";

type DaysOfWeekProps = {
  selection: number[];
  onChange: (value: number) => void;
};

export function DaysOfWeek({ selection, onChange }: DaysOfWeekProps) {
  const id = useId();

  return (
    <fieldset className="space-y-4">
      <div className="flex gap-1.5">
        {WEEK_DAYS.map((item, index) => (
          <label
            key={`${id}-${index}`}
            className="relative flex size-9 cursor-pointer flex-col items-center justify-center gap-3 rounded-full border border-input text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-disabled]]:cursor-not-allowed has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[[data-disabled]]:opacity-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
          >
            <Checkbox
              id={`${id}-${index}`}
              value={index}
              checked={selection.includes(index)}
              onCheckedChange={() => onChange(index)}
              className="sr-only after:absolute after:inset-0"
            />
            <span aria-hidden="true" className="text-sm font-medium">
              {item[0]}
            </span>
            <span className="sr-only">{item}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
