import { relations } from "drizzle-orm/relations";
import { trackers, events, users, settings } from "./schema";

export const eventsRelations = relations(events, ({one}) => ({
	tracker: one(trackers, {
		fields: [events.trackerId],
		references: [trackers.id]
	}),
}));

export const trackersRelations = relations(trackers, ({one, many}) => ({
	events: many(events),
	user: one(users, {
		fields: [trackers.owner],
		references: [users.id]
	}),
}));

export const settingsRelations = relations(settings, ({one}) => ({
	user: one(users, {
		fields: [settings.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	settings: many(settings),
	trackers: many(trackers),
}));