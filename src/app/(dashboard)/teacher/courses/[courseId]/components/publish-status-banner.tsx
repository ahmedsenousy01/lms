"use client";

import { Banner } from "@/components/ui/banner";

import { api } from "@/trpc/react";

export function PublishStatusBanner({
  type,
  courseId,
  chapterId,
}: {
  type: "course" | "chapter";
  courseId?: string;
  chapterId?: string;
}) {
  let isPublished: boolean | undefined;

  if (type === "course") {
    if (!courseId) throw new Error("courseId is required");
    const [course] = api.course.getDetailsById.useSuspenseQuery({
      courseId,
    });
    isPublished = !!course.isPublished;
  } else if (type === "chapter") {
    if (!chapterId || !courseId)
      throw new Error("chapterId and courseId are required");
    const [chapter] = api.chapter.getById.useSuspenseQuery({
      chapterId,
      courseId,
    });
    isPublished = !!chapter.isPublished;
  }

  if (!isPublished)
    return (
      <Banner
        variant="warning"
        label={`This ${type} is not published. It will not be visible to students.`}
      />
    );
}
