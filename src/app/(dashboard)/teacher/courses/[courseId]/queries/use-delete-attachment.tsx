import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useDeleteAttachment({ id }: { id: string }) {
  const utils = api.useUtils();
  return api.attachment.delete.useMutation({
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ id });
    },
    onError: error => {
      toast({
        title: "Error deleting attachment",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
