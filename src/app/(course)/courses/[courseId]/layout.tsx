import { CourseNavbar } from "@/app/(course)/components/course-navbar";
import { CourseSidebar } from "@/app/(course)/components/course-sidebar";

import { type FullCourseDto } from "@/server/api/types/course";
import { type UserProgress } from "@/server/db/schema";
import { api } from "@/trpc/server";

export default async function CourseLayout({
  children,
  params: { courseId },
}: {
  params: { courseId: string };
  children: React.ReactNode;
}) {
  const [course, purchase] = await Promise.all([
    api.course.watch({ courseId }),
    api.course.checkForCoursePurchase({ courseId }),
  ]);

  return (
    <main className="grid h-full md:grid-cols-[auto,1fr]">
      <aside className="hidden h-full md:flex">
        <CourseSidebar
          course={
            course as FullCourseDto & {
              userProgress: UserProgress[];
            }
          }
          purchase={purchase}
        />
      </aside>
      <div className="grid h-screen grid-rows-[auto,1fr]">
        <CourseNavbar
          course={course as FullCourseDto & { userProgress: UserProgress[] }}
          purchase={purchase}
        />
        <div className="overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}
