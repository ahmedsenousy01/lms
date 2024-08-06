import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import {
  chapters,
  courses,
  purchases,
  type SelectCourseWithRelationsWithProgress,
  userProgress,
} from "@/server/db/schema";

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

export async function calculateCourseProgressUseCase({
  courseId,
}: {
  courseId: string;
}) {
  try {
    const user = await getCurrentUser();
    const publishedChapters = await db.query.chapters.findMany({
      columns: {
        id: true,
      },
      where: eq(chapters.courseId, courseId),
    });

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

    const validCompletedChapters = await db.query.userProgress.findMany({
      where: and(
        eq(userProgress.userId, user!.id),
        inArray(userProgress.chapterId, publishedChapterIds),
        eq(userProgress.isCompleted, true)
      ),
    });

    const progressPercentage =
      validCompletedChapters.length / publishedChapters.length;

    return progressPercentage;
  } catch (error) {
    console.log("[CALCULATE_COURSE_PROGRESS_USE_CASE]", error);
    return 0;
  }
}

export async function getCoursesUseCase({
  title,
  categoryId,
}: {
  title?: string;
  categoryId?: string;
}): Promise<SelectCourseWithRelationsWithProgress[]> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not found");

    const whereConditions = [eq(courses.isPublished, true)];
    if (title) {
      whereConditions.push(sql`${courses.title} ILIKE '%' || ${title} || '%'`);
    }
    if (categoryId) {
      whereConditions.push(eq(courses.categoryId, categoryId));
    }

    const dashboardCourses = await db.query.courses.findMany({
      where: and(...whereConditions),
      with: {
        category: true,
        chapters: {
          where: eq(chapters.isPublished, true),
        },
        purchases: {
          where: eq(purchases.userId, user.id),
        },
      },
      orderBy: desc(courses.createdAt),
    });

    const coursesWithProgress = await Promise.all(
      dashboardCourses.map(async course => {
        if (course.purchases.length === 0)
          return {
            ...course,
            progress: null,
          };

        const progressPercentage = await calculateCourseProgressUseCase({
          courseId: course.id,
        });

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES_USE_CASE]", error);
    return [];
  }
}
