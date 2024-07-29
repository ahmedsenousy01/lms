import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useDeleteCourse() {
  const utils = api.useUtils();
  return api.course.delete.useMutation({
    onError: error => {
      toast({
        title: "Error deleting course",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      await utils.course.getAllHeadlines.invalidate();
    },
  });
}
