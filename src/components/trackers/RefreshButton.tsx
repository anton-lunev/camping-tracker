import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RefreshButtonProps = {
  onClick: () => void;
};

export function RefreshButton({ onClick }: RefreshButtonProps) {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="border-transparent"
            size="icon"
            onClick={() => {
              setIsRotating(true);
              onClick();
              setTimeout(() => setIsRotating(false), 500); // Reset after animation
            }}
          >
            <RefreshCwIcon className={isRotating ? "animate-spin" : ""} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Check free spots</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
