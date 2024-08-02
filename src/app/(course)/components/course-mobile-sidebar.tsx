"use client";

import { useRef } from "react";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { type FullCourseDto } from "@/server/api/types/course";
import type { Purchase, UserProgress } from "@/server/db/schema";

import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: FullCourseDto & { userProgress: UserProgress[] };
  purchase: Purchase | null;
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}

export function CourseMobileSidebar(props: CourseMobileSidebarProps) {
  const ref = useRef<HTMLButtonElement>(null); // TODO: move this to a global store (context or zustand)
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-white p-0"
      >
        <CourseSidebar {...props} />
      </SheetContent>
      <SheetClose ref={ref} />
    </Sheet>
  );
}
