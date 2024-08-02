import { usePathname, useRouter } from "next/navigation";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";

import { type Chapter } from "@/server/db/schema";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  chapter: Chapter;
  iscompleted: boolean;
  isLocked: boolean;
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}

export function CourseSidebarItem({
  chapter,
  iscompleted,
  isLocked,
  sheetCloseRef,
}: CourseSidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : iscompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(chapter.id);

  const onClick = () => {
    if (isLocked) {
      return;
    }

    sheetCloseRef?.current?.click();
    router.push(`/courses/${chapter.courseId}/chapters/${chapter.id}`);
  };

  return (
    <button
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        isActive &&
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",
        iscompleted && "text-emerald-700 hover:text-emerald-700",
        iscompleted && isActive && "bg-emerald-200/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          className={cn(
            "size-4 text-slate-500",
            isActive && "text-slate-700",
            iscompleted && "text-emerald-700"
          )}
        />
        {chapter.title}
      </div>
    </button>
  );
}
