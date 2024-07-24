import { redirect } from "next/navigation";

import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { api } from "@/trpc/server";

import CategoryForm from "./category-form";
import DescriptionForm from "./description-form";
import PriceForm from "./price-form";
import ThumbnailForm from "./thumbnail-form";
import TitleForm from "./title-form";

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
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionString = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
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
            <div>TODO: Add chapters</div>
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
        </div>
      </div>
    </div>
  );
}
