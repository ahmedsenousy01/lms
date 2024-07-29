"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";

import { api } from "@/trpc/react";

import { useDeleteCourse } from "../queries/use-delete-course";
import { useUpdateCourse } from "../queries/use-update-course";

export function CourseActions({
  initialData: { courseId },
}: {
  initialData: { courseId: string };
}) {
  const [courseIsComplete, setCourseIsComplete] = useState<boolean>(false);
  const router = useRouter();
  const { mutateAsync: deleteCourse } = useDeleteCourse();
  const { mutateAsync: updateCourse } = useUpdateCourse({ courseId });

  const [course] = api.course.getDetailsById.useSuspenseQuery({ courseId });

  useEffect(() => {
    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.categoryId,
      course.price,
      course.courseChapters.some(chapter => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    setCourseIsComplete(() => totalFields === completedFields);
  }, [
    course.description,
    course.title,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.courseChapters,
  ]);

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={async () => {
          await updateCourse({
            id: course.id,
            isPublished: !course.isPublished,
          });
          router.refresh();
        }}
        disabled={!courseIsComplete}
        variant="outline"
        size="sm"
      >
        {course.isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={async () => {
          await deleteCourse({ id: course.id });
          router.push(`/teacher/courses`);
        }}
      >
        <Button size="sm">
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
