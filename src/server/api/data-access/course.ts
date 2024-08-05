import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";

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
    where: (courses, { eq }) => eq(courses.userId, input.userId),
    with: {
      ...input.with,
      chapters: input.with?.chapters
        ? {
            orderBy: (chapters, { asc }) => [asc(chapters.position)],
            with: {
              userProgress: true,
            },
          }
        : undefined,
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

  return await db.query.courses
    .findFirst({
      where: (courses, { eq }) => eq(courses.id, input.courseId),
      with: {
        ...input.with,
        chapters: input.with?.chapters
          ? {
              orderBy: (chapters, { asc }) => [asc(chapters.position)],
              with: {
                userProgress: true,
              },
            }
          : undefined,
      },
    })
    .execute();
}

export async function getCourses({ query }: { query: string }) {
  return await db.query.courses.findMany({
    where: (courses, { sql }) =>
      sql`to_tsvector('english', ${courses.title}) @@ to_tsquery(${query})`,
    orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    with: {
      category: true,
    },
  });
}
