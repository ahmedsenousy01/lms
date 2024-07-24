import { api } from "@/trpc/react";

export function useCreateCourse() {
  const utils = api.useUtils();

  return api.course.create.useMutation({
    onSuccess: ({ id }) => {
      void utils.course.getDetailsById.prefetch({ id });
      void utils.course.invalidate();
    },
  });
}
