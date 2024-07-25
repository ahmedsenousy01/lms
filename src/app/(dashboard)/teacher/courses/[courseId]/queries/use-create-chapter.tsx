import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useCreateChapter({ id }: { id: string }) {
  const utils = api.useUtils();
  return api.chapter.create.useMutation({
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ id });
    },
    onError: error => {
      toast({
        title: "Error creating chapter",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
