import { redirect } from "next/navigation";

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { api } from "@/trpc/server";

import AttachmentsForm from "./components/attachments-form";
import CategoryForm from "./components/category-form";
import ChaptersForm from "./components/chapters-form";
import DescriptionForm from "./components/description-form";
import PriceForm from "./components/price-form";
import ThumbnailForm from "./components/thumbnail-form";
import TitleForm from "./components/title-form";

export default async function CoursesPage({
  params: { courseId },
}: {
  params: { courseId: string };
}) {
  const [courseResult, categoriesResult] = await Promise.allSettled([
    api.course.getDetailsById({ id: courseId }),
    api.category.getAll(),
  ]).catch(() => redirect("/"));

  if (
    courseResult.status === "rejected" ||
    categoriesResult.status === "rejected"
  )
    redirect("/");

  const course = courseResult.value;
  const categoriesList = categoriesResult.value;

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.courseChapters.some(chapter => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionString = `(${completedFields}/${totalFields})`;

  return (
    <div className="px-2 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionString}
          </span>
        </div>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge
              icon={LayoutDashboard}
              size="sm"
            />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ThumbnailForm initialData={course} />
          <CategoryForm
            initialData={course}
            options={categoriesList.map(category => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={ListChecks}
                size="sm"
              />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <ChaptersForm initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={CircleDollarSign}
                size="sm"
              />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={File}
                size="sm"
              />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentsForm initialData={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
