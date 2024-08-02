import { NavbarRoutes } from "@/app/(dashboard)/_navbar/navbar-routes";

import { type FullCourseDto } from "@/server/api/types/course";
import type { Purchase, UserProgress } from "@/server/db/schema";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: FullCourseDto & { userProgress: UserProgress[] };
  purchase: Purchase | null;
}

export function CourseNavbar({ course, purchase }: CourseNavbarProps) {
  return (
    <nav className="flex items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar
        course={course}
        purchase={purchase}
      />
      <NavbarRoutes />
    </nav>
  );
}
