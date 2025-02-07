import {
  boolean,
  date,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export type Camping = {
  id: string;
  name: string;
  provider: string;
};

export type TrackingStateItem = {
  campingId: string;
  sites: { date: string; siteId: string; isFree: boolean }[];
};
export type TrackingState = Record<string, TrackingStateItem>;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false, mode: "string" })
    .defaultNow()
    .notNull(),
  email: text("email").notNull(),
});
export type User = typeof users.$inferSelect;

export const trackers = pgTable("trackers", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  campings: json("campings").array().$type<Camping[]>().notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  weekDays: integer("week_days").array().default([]).notNull(),
  days: date("days").array().default([]).notNull(),
  active: boolean("active").default(false).notNull(),
  interval: integer("interval").default(60).notNull(),
  owner: uuid("owner")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackingState: json("tracking_state")
    .$type<TrackingState>()
    .default({})
    .notNull(),
});
export type Tracker = typeof trackers.$inferSelect;

export const settings = pgTable("settings", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  telegramChannelId: varchar("telegram_channel_id", { length: 255 }),
});
export type Settings = typeof settings.$inferSelect;

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  trackerId: uuid("tracker_id")
    .notNull()
    .references(() => trackers.id, { onDelete: "cascade" }),
  openSpots: json("open_spots"),
});
export type Event = typeof events.$inferSelect;

export const trackersRelations = relations(trackers, ({ one, many }) => ({
  events: many(events),
  users: one(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
  trackers: many(trackers),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  users: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  tracker: one(trackers, {
    fields: [events.trackerId],
    references: [trackers.id],
  }),
}));
