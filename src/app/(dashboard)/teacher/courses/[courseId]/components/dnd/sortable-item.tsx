"use client";

import React from "react";

// import { DraggableAttributes } from "@dnd-kit/core/dist/hooks";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DragHandle = ({ listeners }: { listeners?: SyntheticListenerMap }) => (
  <span
    {...listeners}
    style={{ cursor: "grab", padding: "0 10px" }}
  >
    ⠿
  </span>
);

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Translate.toString({
      ...transform!,
      x: 0,
    }),
    transition,
    touchAction: "manipulation",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-x-2 hover:bg-slate-50"
    >
      <DragHandle listeners={listeners} />
      {children}
    </div>
  );
}
