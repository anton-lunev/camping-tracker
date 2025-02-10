"use client";

import { CampingTrackerCards } from "./CampingTrackerCards";
import { TrackerForm } from "./TrackerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { createTracker, removeTracker, updateTracker } from "./actions";
import { Button } from "@/components/ui/button";
import type { NewTracker } from "@/db/queries/trackers";
import { sbClient } from "@/db/sbClient";
import type { Tracker } from "@/db/schema";
import { trackersSchema } from "@/db/schema";
import camelcaseKeys from "camelcase-keys";

type TrackersProps = {
  trackers: Tracker[];
};

export function Trackers({ trackers }: TrackersProps) {
  const [trackersData, setTrackersData] = useState<Tracker[]>(trackers);
  useEffect(() => {
    setTrackersData(trackers);
  }, [trackers]);

  useEffect(() => {
    const channel = sbClient()
      .channel("trackers")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "trackers" },
        (payload) => {
          const updatedTracker = trackersSchema.parse(
            camelcaseKeys(payload.new),
          ) as Tracker;
          setTrackersData((prev) => {
            const newTrackers = [...prev];
            newTrackers[
              prev.findIndex((item) => item.id === updatedTracker.id)
            ] = updatedTracker;
            return newTrackers;
          });
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const handleEdit = (id: string) => {
    const trackerToEdit = trackersData.find((tracker) => tracker.id === id);
    if (trackerToEdit) {
      setEditingTracker(trackerToEdit);
    }
  };

  const handleSave = (updatedTracker: Tracker) => {
    updateTracker(updatedTracker);
    setEditingTracker(null);
    handleCancel();
  };
  const handleCreate = (newTracker: NewTracker) => {
    createTracker(newTracker);
    handleCancel();
  };
  const handleRemove = (tracker: Tracker) => {
    removeTracker(tracker.id);
    handleCancel();
  };

  const handleCancel = () => {
    setEditingTracker(null);
    setIsCreating(false);
  };

  return (
    <div className="flex justify-center items-center flex-col gap-4 w-full">
      <div
        className="w-full flex justify-center items-center gap-2 bg-contain bg-[url(/header.jpeg)] p-4 aspect-3840/600"
        style={{
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        }}
      >
        <h1 className="text-4xl font-extralight drop-shadow-xs">
          Camping Trackers
        </h1>
        <Button size="icon" onClick={() => setIsCreating(true)}>
          +
        </Button>
      </div>

      <CampingTrackerCards trackers={trackersData} onEdit={handleEdit} />

      <Dialog
        open={editingTracker !== null || isCreating}
        onOpenChange={handleCancel}
      >
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>
              {editingTracker ? "Edit Tracker" : "New Tracker"}
            </DialogTitle>
          </DialogHeader>
          <TrackerForm
            tracker={editingTracker ?? undefined}
            onSave={editingTracker ? handleSave : handleCreate}
            onRemove={editingTracker && !isCreating ? handleRemove : undefined}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
