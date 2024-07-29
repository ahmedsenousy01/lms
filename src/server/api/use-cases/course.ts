import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { chapters, courses } from "@/server/db/schema";

export async function unpublishCourseIfNoPublishedChapters({
  courseId,
}: {
  courseId: string;
}) {
  const courseChapters = await db
    .select({
      isPublished: chapters.isPublished,
    })
    .from(chapters)
    .where(eq(chapters.courseId, courseId));

  const hasPublishedChapters = courseChapters.some(
    chapter => chapter.isPublished
  );

  if (!hasPublishedChapters) {
    await db
      .update(courses)
      .set({ isPublished: false })
      .where(eq(courses.id, courseId))
      .execute();
  }
}
