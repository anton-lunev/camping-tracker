import {
  boolean,
  date,
  foreignKey,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    trackerId: uuid("tracker_id").notNull(),
    openSpots: json("open_spots"),
  },
  (table) => [
    foreignKey({
      columns: [table.trackerId],
      foreignColumns: [trackers.id],
      name: "events_tracker_id_trackers_id_fk",
    }).onDelete("cascade"),
  ],
);

export const users = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  email: text().notNull(),
  fullName: text("full_name"),
});

export const settings = pgTable(
  "settings",
  {
    userId: uuid("user_id").notNull(),
    telegramChannelId: varchar("telegram_channel_id", { length: 255 }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "settings_user_id_users_id_fk",
    }).onDelete("cascade"),
  ],
);

export const trackers = pgTable(
  "trackers",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    campings: json().array().notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    weekDays: integer("week_days").array().default([]).notNull(),
    days: date().array().default([""]).notNull(),
    active: boolean().default(false).notNull(),
    interval: integer().default(60).notNull(),
    owner: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.owner],
      foreignColumns: [users.id],
      name: "trackers_owner_users_id_fk",
    }).onDelete("cascade"),
  ],
);
