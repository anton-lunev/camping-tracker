import type { ChangeEvent } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCampingDataByUrl } from "./actions";
import type { Camping } from "@/db/schema";
import { CampingBadge } from "@/components/trackers/CampingBadge";
import { PopoverClose } from "@/components/ui/popover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AddCampingPopoverContentProps {
  onCampingAdd: (camping: Camping) => void;
}

export function AddCampingPopoverContent({
  onCampingAdd,
}: AddCampingPopoverContentProps) {
  const [campingUrl, setCampingUrl] = useState("");
  const [campingData, setCampingData] = useState<Camping | null>(null);

  const handleCampingUrlChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCampingUrl(url);
    if (!url) {
      setCampingData(null);
      return;
    }
    const data = await getCampingDataByUrl(url);
    console.log(data);
    setCampingData(data);
  };

  const addCamping = async () => {
    if (!campingData) return;
    try {
      onCampingAdd(campingData);
      setCampingUrl("");
      setCampingData(null);
    } catch (error) {
      console.error("Error adding camping:", error);
    }
  };

  return (
    <div className="grid gap-2 py-2">
      <Input
        autoFocus
        placeholder="Enter camping URL"
        value={campingUrl}
        onChange={handleCampingUrlChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addCamping();
          }
        }}
      />
      {campingData ? <CampingBadge camping={campingData} /> : null}
      {campingData?.imgUrls?.length ? (
        <Carousel className="w-full">
          <CarouselContent>
            {campingData.imgUrls.map((imgUrl, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img
                    className="overflow-hidden rounded-md"
                    src={imgUrl}
                    alt="camping image"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : null}
      <PopoverClose asChild>
        <Button variant="outline" onClick={addCamping} disabled={!campingData}>
          Add Camping
        </Button>
      </PopoverClose>
    </div>
  );
}
