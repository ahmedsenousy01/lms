"use client";

import type {
  SelectCourseWithRelations,
  SelectPurchase,
} from "@/server/db/schema";

import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: SelectCourseWithRelations;
  purchase: SelectPurchase | null;
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}

export function CourseSidebar({
  course,
  purchase,
  sheetCloseRef,
}: CourseSidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course?.title}</h1>
        {/* check progress and confirm purchase */}
      </div>
      <div className="flex w-full flex-col">
        {course?.chapters?.map(chapter => (
          <CourseSidebarItem
            key={chapter.id}
            chapter={chapter}
            iscompleted={
              !!chapter.userProgress?.find(
                userProgress => userProgress.chapterId === chapter.id
              )?.isCompleted
            }
            isLocked={!chapter.isFree && !purchase}
            sheetCloseRef={sheetCloseRef}
          />
        ))}
      </div>
    </div>
  );
}
