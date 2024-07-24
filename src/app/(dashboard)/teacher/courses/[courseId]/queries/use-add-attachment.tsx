import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useAddAttachment({ id }: { id: string }) {
  const utils = api.useUtils();
  return api.attachment.add.useMutation({
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ id });
    },
    onError: error => {
      toast({
        title: "Error adding attachment",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
