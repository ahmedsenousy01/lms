import { api } from "@/trpc/react";

export function useGetCourseDetails({ courseId }: { courseId: string }) {
  const utils = api.useUtils();
  const [data, queryInfo] = api.course.getDetailsById.useSuspenseQuery({
    courseId,
  });

  if (queryInfo.isLoading) {
    return { isLoading: true, data: null, error: null, isError: false };
  }

  if (queryInfo.isError) {
    return {
      isLoading: false,
      data: null,
      error: queryInfo.error,
      isError: true,
    };
  }

  if (data.chapters?.length) {
    data.chapters.forEach(chapter => {
      utils.chapter.getById.setData(
        { chapterId: chapter.id, courseId },
        old => ({
          ...old!,
          ...chapter,
        })
      );
    });
  }

  return { isLoading: false, data, error: null, isError: false };
}
