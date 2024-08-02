import { and, eq, inArray, sql } from "drizzle-orm";

import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { chapters, courses, userProgress } from "@/server/db/schema";

export async function getUserCourses(input: {
  userId: string;
  with?: {
    user?: true;
    category?: true;
    attachments?: true;
    chapters?: true;
  };
}) {
  return await db.query.courses.findMany({
    where: eq(courses.userId, input.userId),
    with: {
      ...input.with,
    },
  });
}

export async function getCourseDetailsById(input: {
  courseId: string;
  with?: {
    user?: true;
    category?: true;
    attachments?: true;
    chapters?: true;
  };
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, input.courseId),
    with: {
      ...input.with,
      chapters: {
        orderBy: chapters.position,
      },
    },
  });

  const userCourseProgress = await db.query.userProgress.findMany({
    where: and(
      inArray(
        userProgress.chapterId,
        course?.chapters.map(chapter => chapter.id) ?? []
      ),
      eq(userProgress.userId, user.id)
    ),
  });

  return {
    ...course,
    userProgress: userCourseProgress,
  };
}

export async function getCourses({ query }: { query: string }) {
  return await db.query.courses.findMany({
    where: sql`to_tsvector('english', ${courses.title}) @@ to_tsquery(${query})`,
    orderBy: courses.createdAt,
    with: {
      category: true,
    },
  });
}
