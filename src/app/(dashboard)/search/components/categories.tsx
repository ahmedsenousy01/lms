"use client";

import { type IconType } from "react-icons";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";

import { type Category } from "@/server/db/schema";
import { api } from "@/trpc/react";

import { CategoryItem } from "./category-item";

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  "Computer Science": FcMultipleDevices,
  Accounting: FcSalesPerformance,
  Fitness: FcSportsMode,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
};

export function Categories() {
  const [categories] = api.category.getAll.useSuspenseQuery();

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
          icon={iconMap[category.name]}
        />
      ))}
    </div>
  );
}
