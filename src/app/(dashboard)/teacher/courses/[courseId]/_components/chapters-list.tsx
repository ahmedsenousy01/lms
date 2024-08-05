"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import type { Chapter } from "@/server/db/schema";
import { api } from "@/trpc/react";

import { SortableList } from "./dnd/chapters-list";

interface ChaptersListProps {
  chapters: Chapter[];
  courseId: string;
}

export default function ChaptersList({
  chapters,
  courseId,
}: ChaptersListProps) {
  const { mutateAsync: reorderChapters, isPending } =
    api.chapter.reorder.useMutation();
  const [items, setItems] = useState(chapters);

  async function dbPersist(items: Chapter[]) {
    return await reorderChapters({
      chapters: items.map((item, idx) => ({
        id: item.id,
        newPosition: idx + 1,
      })),
      courseId,
    });
  }

  if (isPending)
    return (
      <>
        <SortableList
          items={items}
          setItems={setItems}
          dbPersist={dbPersist}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-slate-300/50 backdrop-blur-sm">
          Saving <Loader2 className="ml-2 h-6 w-6 animate-spin" />
        </div>
      </>
    );

  return (
    <SortableList
      items={items}
      setItems={setItems}
      dbPersist={dbPersist}
    />
  );
}
