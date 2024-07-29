import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useUpdateChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const utils = api.useUtils();
  return api.chapter.update.useMutation({
    onSuccess: chapter => {
      utils.chapter.getById.setData({ chapterId, courseId }, old => {
        return {
          ...old!,
          ...chapter,
        };
      });
      toast({
        title: "Course updated",
        description: "The course has been updated",
        variant: "success",
      });
    },
    onError: error => {
      toast({
        title: "Error updating course",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      await utils.chapter.getById.invalidate({ chapterId, courseId });
      await utils.course.getDetailsById.invalidate(
        { courseId },
        {
          type: "all",
        }
      );
    },
  });
}
