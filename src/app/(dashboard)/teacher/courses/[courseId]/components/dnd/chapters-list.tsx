"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type InferSelectModel } from "drizzle-orm";

import type { chapters } from "@/server/db/schema";

import { SortableItem } from "./sortable-item";

type Chapter = InferSelectModel<typeof chapters>;

export function SortableList({
  items,
  setItems,
  dbPersist,
}: {
  items: InferSelectModel<typeof chapters>[];
  setItems: React.Dispatch<
    React.SetStateAction<InferSelectModel<typeof chapters>[]>
  >;
  dbPersist: (items: InferSelectModel<typeof chapters>[]) => Promise<unknown>;
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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
          >
            {item.title}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
