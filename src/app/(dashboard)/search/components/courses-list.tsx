"use client";

import { useSearchParams } from "next/navigation";

import { api } from "@/trpc/react";

import { CourseCard } from "./course-card";

export function CoursesList() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const categoryId = searchParams.get("categoryId");

  const [courses] = api.course.browse.useSuspenseQuery({
    title: title ?? undefined,
    categoryId: categoryId ?? undefined,
  });

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">
          No courses found
        </p>
      )}
    </div>
  );
}
