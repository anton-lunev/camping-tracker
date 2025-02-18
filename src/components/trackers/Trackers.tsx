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
import { Button } from "@/components/ui/button";
import type { NewTracker } from "@/db/queries/trackers";
import { sbClient } from "@/db/sbClient";
import type { Tracker } from "@/db/schema";
import { trackersSchema } from "@/db/schema";
import camelcaseKeys from "camelcase-keys";
import { Portal } from "@/components/Portal";
import {
  createTracker,
  refreshTracker,
  removeTracker,
  updateTracker,
} from "@/components/trackers/actions";

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
        { event: "*", schema: "public", table: "trackers" },
        (payload) => {
          console.info("event", payload);
          setTrackersData((prev) => {
            if (payload.eventType === "INSERT") {
              const newTracker = trackersSchema.parse(
                camelcaseKeys(payload.new),
              ) as Tracker;
              return [...prev, newTracker];
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((item) => item.id !== payload.old.id);
            }
            if (payload.eventType === "UPDATE") {
              const updatedTracker = trackersSchema.parse(
                camelcaseKeys(payload.new),
              ) as Tracker;
              const newTrackers = [...prev];
              const index = prev.findIndex(
                (item) => item.id === updatedTracker.id,
              );
              if (index !== -1) {
                newTrackers[index] = updatedTracker;
              }
              return newTrackers;
            }
            return prev;
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

  const handleSave = async (updatedTracker: Tracker) => {
    await updateTracker(updatedTracker);
    setEditingTracker(null);
    closeModal();
  };
  const handleCreate = async (newTracker: NewTracker) => {
    await createTracker(newTracker);
    closeModal();
  };
  const handleRemove = async (tracker: Tracker) => {
    await removeTracker(tracker.id);
    closeModal();
  };

  const closeModal = () => {
    setEditingTracker(null);
    setIsCreating(false);
  };

  const toggleActive = (tracker: Tracker) => {
    void handleSave({ ...tracker, active: !tracker.active });
  };
  const handleRefresh = (tracker: Tracker) => {
    void refreshTracker(tracker);
  };

  return (
    <>
      <Portal targetId="header-slot">
        <h1 className="text-4xl font-extralight drop-shadow-xs">
          Camping Trackers
        </h1>
        <Button size="icon" onClick={() => setIsCreating(true)}>
          +
        </Button>
      </Portal>

      <CampingTrackerCards
        trackers={trackersData}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        toggleActive={toggleActive}
      />

      <Dialog
        open={editingTracker !== null || isCreating}
        onOpenChange={closeModal}
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
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
