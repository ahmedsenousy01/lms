import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useUpdateCourse({ courseId }: { courseId: string }) {
  const utils = api.useUtils();
  return api.course.update.useMutation({
    onSuccess: async course => {
      utils.course.getDetailsById.setData({ courseId }, old => {
        return {
          ...old!,
          ...course,
        };
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
      await utils.course.getDetailsById.invalidate({ courseId });
    },
  });
}
