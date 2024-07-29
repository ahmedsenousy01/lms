"use client";

import { api } from "@/trpc/react";

export function CompletionIndecator({
  type,
  courseId,
  chapterId,
}: {
  type: "course" | "chapter";
  courseId?: string;
  chapterId?: string;
}) {
  let completionString: string | undefined;

  if (type === "course") {
    if (!courseId) throw new Error("courseId is required");
    const [course] = api.course.getDetailsById.useSuspenseQuery({
      courseId,
    });

    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId,
      course.courseChapters.some(chapter => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    completionString = `(${completedFields}/${totalFields})`;
  } else if (type === "chapter") {
    if (!chapterId || !courseId)
      throw new Error("chapterId and courseId are required");
    const [chapter] = api.chapter.getById.useSuspenseQuery({
      chapterId,
      courseId,
    });

    const requiredFields = [
      chapter.title,
      chapter.description,
      chapter.videoUrl,
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    completionString = `(${completedFields}/${totalFields})`;
  }

  return (
    <span className="text-sm text-slate-700">
      Complete all fields {completionString}
    </span>
  );
}
