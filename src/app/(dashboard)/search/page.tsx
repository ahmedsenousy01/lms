import Link from "next/link";

import { api } from "@/trpc/server";

export default async function SearchPage() {
  const courses = await api.course.getAllHeadlines();
  return (
    <div className="grid content-center justify-center gap-4">
      {courses.map(course => (
        <Link
          href={`/teacher/courses/${course.id}`}
          className="rounded-md border border-gray-200 p-6 shadow-md"
          key={course.id}
        >
          {course.title}
        </Link>
      ))}
    </div>
  );
}
