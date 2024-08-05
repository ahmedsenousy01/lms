"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";

import { api } from "@/trpc/react";

import { useDeleteChapter } from "../_queries/use-delete-chapter";
import { useUpdateChapter } from "../_queries/use-update-chapter";

export function ChapterActions({
  initialData: { chapterId, courseId },
}: {
  initialData: { chapterId: string; courseId: string };
}) {
  const [chapterIsComplete, setChapterIsComplete] = useState<boolean>(false);
  const router = useRouter();
  const { mutateAsync: deleteChapter } = useDeleteChapter({
    courseId,
  });
  const { mutateAsync: updateChapter } = useUpdateChapter({
    chapterId,
    courseId,
  });
  const [chapter] = api.chapter.getById.useSuspenseQuery({
    chapterId,
    courseId,
  });

  useEffect(() => {
    const requiredFields = [
      chapter.title,
      chapter.description,
      chapter.videoUrl,
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    setChapterIsComplete(() => totalFields === completedFields);
  }, [chapter.description, chapter.title, chapter.videoUrl]);

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={async () => {
          await updateChapter({
            chapter: {
              id: chapter.id,
              isPublished: !chapter.isPublished,
            },
            courseId,
          });
          router.refresh();
        }}
        disabled={!chapterIsComplete}
        variant="outline"
        size="sm"
      >
        {chapter.isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={async () => {
          await deleteChapter(
            { id: chapter.id, courseId },
            {
              onSettled: () => {
                console.log("deleted");
              },
            }
          );
          router.push(`/teacher/courses/${courseId}`);
        }}
      >
        <Button size="sm">
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
