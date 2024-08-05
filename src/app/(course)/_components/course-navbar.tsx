import { NavbarRoutes } from "@/app/_components/navbar/navbar-routes";

import type {
  SelectCourseWithRelations,
  SelectPurchase,
} from "@/server/db/schema";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: SelectCourseWithRelations;
  purchase: SelectPurchase | null;
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
