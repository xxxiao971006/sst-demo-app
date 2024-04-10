import {
  pgTable,
  text,
  varchar,
  timestamp,
  index,
  serial,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        kindeUserId: text("kinde_user_id").notNull(),
        email: text("email").notNull(),
        familyName: text("family_name").notNull(),
        givenName: text("given_name").notNull(),
    },
    (table) => {
        return {
        emailIdx: index("email_idx").on(table.email),
        };
    },
    );

export const pets = pgTable(
  "pets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    species: varchar("species", { length: 100 }).notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  
);