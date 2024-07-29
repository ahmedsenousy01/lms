import { Suspense } from "react";

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { api, HydrateClient } from "@/trpc/server";

import AttachmentsForm from "./components/attachments-form";
import CategoryForm from "./components/category-form";
import ChaptersForm from "./components/chapters-form";
import { CompletionIndecator } from "./components/completion-indecator";
import { CourseActions } from "./components/course-actions";
import DescriptionForm from "./components/description-form";
import PriceForm from "./components/price-form";
import { PublishStatusBanner } from "./components/publish-status-banner";
import ThumbnailForm from "./components/thumbnail-form";
import TitleForm from "./components/title-form";

export default async function CoursesPage({
  params: { courseId },
}: {
  params: { courseId: string };
}) {
  void api.course.getDetailsById.prefetch({ courseId });
  void api.category.getAll.prefetch();

  return (
    <>
      <HydrateClient>
        <PublishStatusBanner
          type="course"
          courseId={courseId}
        />
        <div className="px-2 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Course setup</h1>
              <Suspense>
                <CompletionIndecator
                  type="course"
                  courseId={courseId}
                />
              </Suspense>
            </div>
            <CourseActions initialData={{ courseId }} />
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
              <TitleForm courseId={courseId} />
              <DescriptionForm courseId={courseId} />
              <ThumbnailForm courseId={courseId} />
              <CategoryForm courseId={courseId} />
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
                <ChaptersForm courseId={courseId} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge
                    icon={CircleDollarSign}
                    size="sm"
                  />
                  <h2 className="text-xl">Sell your course</h2>
                </div>
                <PriceForm courseId={courseId} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge
                    icon={File}
                    size="sm"
                  />
                  <h2 className="text-xl">Resources & Attachments</h2>
                </div>
                <AttachmentsForm courseId={courseId} />
              </div>
            </div>
          </div>
        </div>
      </HydrateClient>
    </>
  );
}
