import { redirect } from "next/navigation";

import { api } from "@/trpc/server";

export default async function CoursePage({
  params: { courseId },
}: {
  params: { courseId: string };
}) {
  const course = await api.course.watch({ courseId });
  if (!course) return redirect("/");

  return redirect(
    `/courses/${course.id}/chapters/${course?.chapters?.[0]?.id}`
  );
}
