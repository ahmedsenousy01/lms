import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { type CourseWithCategoryWithUserProgress } from "@/server/api/types/course";

import { formatPrice } from "@/lib/utils";

export function CourseCard({
  course: { id, title, imageUrl, price, progress, category, chapters },
}: {
  course: CourseWithCategoryWithUserProgress;
}) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={imageUrl!}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category?.name}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge
                icon={BookOpen}
                size="sm"
              />
              <span>
                {chapters.length}{" "}
                {chapters.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            true
          ) : (
            <>
              <p className="text-md font-medium text-slate-700 md:text-sm">
                {formatPrice(price!)}
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
