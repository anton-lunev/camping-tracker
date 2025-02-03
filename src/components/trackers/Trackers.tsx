"use client";

import CampingTrackerCards from "./CampingTrackerCards";
import TrackerForm from "./TrackerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createTracker, NewTracker, Tracker, updateTracker } from "./actions";
import { Button } from "@/components/ui/button";

type TrackersProps = {
  trackers: Tracker[];
};

export function Trackers({ trackers }: TrackersProps) {
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const handleEdit = (id: string) => {
    const trackerToEdit = trackers.find((tracker) => tracker.id === id);
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

      <CampingTrackerCards trackers={trackers} onEdit={handleEdit} />

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
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
