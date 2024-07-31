import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { courses } from "@/server/db/schema";

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
  return await db.query.courses.findFirst({
    where: eq(courses.id, input.courseId),
    with: {
      ...input.with,
    },
  });
}
