import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useDeleteChapter({ courseId }: { courseId: string }) {
  const utils = api.useUtils();
  return api.chapter.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Chapter deleted",
        description: "The chapter has been deleted",
        variant: "success",
      });
    },
    onError: error => {
      toast({
        title: "Error deleting chapter",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },

    onSettled: async () => {
      await utils.course.getDetailsById.invalidate(
        { courseId },
        {
          type: "all",
        }
      );
    },
  });
}
