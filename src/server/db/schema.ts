import { type AdapterAccount } from "next-auth/adapters";

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `lms_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  password: varchar("password", { length: 255 }),
  image: varchar("image", { length: 255 }),
  stripeCustomerId: varchar("customer_id", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  courses: many(courses),
  purchases: many(purchases),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type SelectUserWithRelations = typeof users.$inferSelect & {
  accounts?: SelectAccount[] | null;
  courses?: SelectCourse[] | null;
  purchases?: SelectPurchase[] | null;
};

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export type InsertAccount = typeof accounts.$inferInsert;
export type SelectAccount = typeof accounts.$inferSelect;
export type SelectAccountWithRelations = typeof accounts.$inferSelect & {
  user?: SelectUser | null;
};

export const courses = createTable(
  "course",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: varchar("image_url", { length: 255 }),
    price: real("price"),
    isPublished: boolean("is_published").default(false),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    categoryId: varchar("category_id", { length: 255 }).references(
      () => categories.id
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  course => ({
    titleIndex: index("course_title_idx").on(course.title),
    userIdIdx: index("course_user_id_idx").on(course.userId),
  })
);

export type InsertCourse = typeof courses.$inferInsert;
export type SelectCourse = typeof courses.$inferSelect;
export type SelectCourseWithRelations = typeof courses.$inferSelect & {
  user?: SelectUser | null;
  category?: SelectCategory | null;
  attachments?: SelectAttachment[] | null;
  chapters?: SelectChapterWithRelations[] | null;
  purchases?: SelectPurchase[] | null;
};

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  attachments: many(attachments),
  chapters: many(chapters),
  purchases: many(purchases),
}));

export const categories = createTable(
  "category",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).unique().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  category => ({
    nameIndex: index("category_name_idx").on(category.name),
  })
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(courses),
}));

export type InsertCategory = typeof categories.$inferInsert;
export type SelectCategory = typeof categories.$inferSelect;
export type SelectCategoryWithRelations = typeof categories.$inferSelect & {
  courses?: SelectCourse[] | null;
};

export const attachments = createTable(
  "attachment",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }),
    courseId: varchar("course_id", { length: 255 })
      .notNull()
      .references(() => courses.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  attachment => ({
    nameIndex: index("attachment_name_idx").on(attachment.name),
  })
);

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}));

export type InsertAttachment = typeof attachments.$inferInsert;
export type SelectAttachment = typeof attachments.$inferSelect;
export type SelectAttachmentWithRelations = typeof attachments.$inferSelect & {
  course?: SelectCourse | null;
};

export const chapters = createTable(
  "chapter",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    videoUrl: varchar("video_url", { length: 255 }),
    position: integer("position"),
    isPublished: boolean("is_published").default(false),
    isFree: boolean("is_free").default(false),
    courseId: varchar("course_id", { length: 255 })
      .notNull()
      .references(() => courses.id),
    muxAssetId: varchar("asset_id", { length: 255 }),
    muxPlaybackId: varchar("playback_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  chapter => ({
    titleIndex: index("chapter_title_idx").on(chapter.title),
    courseIdIdx: index("chapter_course_id_idx").on(chapter.courseId),
  })
);

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  userProgress: many(userProgress),
}));

export type InsertChapter = typeof chapters.$inferInsert;
export type SelectChapter = typeof chapters.$inferSelect;
export type SelectChapterWithRelations = SelectChapter & {
  userProgress?: SelectUserProgress[] | null;
  course?: SelectCourse | null;
};

export const userProgress = createTable("user_progress", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  chapterId: varchar("chapter_id", { length: 255 })
    .notNull()
    .references(() => chapters.id),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [userProgress.chapterId],
    references: [chapters.id],
  }),
}));

export type InsertUserProgress = typeof userProgress.$inferInsert;
export type SelectUserProgress = typeof userProgress.$inferSelect;
export type SelectUserProgressWithRelations = InsertUserProgress & {
  user?: SelectUser | null;
  chapter?: SelectChapter | null;
};

export const purchases = createTable("purchase", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  courseId: varchar("course_id", { length: 255 })
    .notNull()
    .references(() => courses.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}));

export type InsertPurchase = typeof purchases.$inferInsert;
export type SelectPurchase = typeof purchases.$inferSelect;
export type SelectPurchaseWithRelations = InsertPurchase & {
  user?: SelectUser | null;
  course?: SelectCourse | null;
};
