import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export function useAddAttachment({ courseId }: { courseId: string }) {
  const utils = api.useUtils();
  return api.attachment.add.useMutation({
    onSuccess: attachment => {
      utils.course.getDetailsById.setData({ courseId }, old => {
        return {
          ...old!,
          courseAttachments: [
            ...(old?.attachments ?? []),
            {
              ...attachment,
              updatedAt: null,
              createdAt: new Date(),
            },
          ],
        };
      });
    },
    onError: error => {
      toast({
        title: "Error adding attachment",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      await utils.course.getDetailsById.invalidate({ courseId });
    },
  });
}
