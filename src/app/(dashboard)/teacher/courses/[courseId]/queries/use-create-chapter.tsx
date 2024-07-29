import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useCreateChapter({ courseId }: { courseId: string }) {
  const utils = api.useUtils();
  return api.chapter.create.useMutation({
    onSuccess: chapter => {
      utils.course.getDetailsById.setData({ courseId }, old => {
        return {
          ...old!,
          courseChapters: [...(old?.courseChapters ?? []), chapter],
        };
      });
    },
    onError: error => {
      toast({
        title: "Error creating chapter",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ courseId });
    },
  });
}
