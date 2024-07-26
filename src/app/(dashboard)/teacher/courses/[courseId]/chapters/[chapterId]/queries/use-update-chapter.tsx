import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useUpdateChapter({ id }: { id: string }) {
  const utils = api.useUtils();
  return api.chapter.update.useMutation({
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ id });
    },
    onError: error => {
      toast({
        title: "Error updating course",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
