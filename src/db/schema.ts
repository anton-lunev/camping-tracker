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
import { createSelectSchema } from "drizzle-zod";

export type Camping = {
  id: string;
  name: string;
  provider: string;
};

export type TrackingStateItem = {
  campingId: string;
  sites: { date: string; siteId: string; siteName: string; isFree: boolean }[];
};
export type TrackingState = Record<string, TrackingStateItem>;

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
  owner: text("owner").notNull(),
  trackingState: json("tracking_state")
    .$type<TrackingState>()
    .default({})
    .notNull(),
});
export type Tracker = typeof trackers.$inferSelect;
export const trackersSchema = createSelectSchema(trackers);

export const settings = pgTable("settings", {
  userId: text("user_id").notNull(),
  telegramChannelId: varchar("telegram_channel_id", { length: 255 }),
});
export type Settings = typeof settings.$inferSelect;
