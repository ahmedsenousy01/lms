import Link from "next/link";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Chapter } from "@/server/db/schema";

import { cn } from "@/lib/utils";

import { SortableItem } from "./sortable-item";

export function SortableList({
  items,
  setItems,
  dbPersist,
}: {
  items: Chapter[];
  setItems: React.Dispatch<React.SetStateAction<Chapter[]>>;
  dbPersist: (items: Chapter[]) => Promise<unknown>;
}) {
  let reorderedItems: Chapter[] = [];
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        reorderedItems = arrayMove(items, oldIndex, newIndex);
        return reorderedItems;
      });
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    handleDragEnd(event);
    await dbPersist(reorderedItems);
  }

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  return (
    <div className={`max-h-[${items.length * 48}px] overflow-hidden`}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:text-sky-700 active:text-sky-700"
            >
              <SortableItem
                key={item.id}
                id={item.id}
              >
                <p className="line-clamp-1">{item.title}</p>
                <div className="ml-auto flex items-center gap-x-3 pr-2">
                  {item.isFree && <Badge>Free</Badge>}
                  <Badge
                    className={cn(
                      "bg-slate-500",
                      item.isPublished && "bg-sky-500"
                    )}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Link
                    href={`/teacher/courses/${item.courseId}/chapters/${item.id}`}
                    className="size-4 transition hover:opacity-75"
                  >
                    <Pencil className="size-full" />
                  </Link>
                </div>
              </SortableItem>
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
