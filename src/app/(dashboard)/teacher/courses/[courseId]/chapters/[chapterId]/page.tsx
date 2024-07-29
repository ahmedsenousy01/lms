import { Suspense } from "react";

import Link from "next/link";

import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { api, HydrateClient } from "@/trpc/server";

import { CompletionIndecator } from "../../components/completion-indecator";
import { PublishStatusBanner } from "../../components/publish-status-banner";
import ChapterAccessForm from "./components/chapter-access-form";
import { ChapterActions } from "./components/chapter-actions";
import ChapterDescriptionForm from "./components/chapter-description-form";
import ChapterTitleForm from "./components/chapter-title-form";
import ChapterVideoForm from "./components/chapter-video-form";

export default async function CourseChapterPage({
  params: { courseId, chapterId },
}: {
  params: { courseId: string; chapterId: string };
}) {
  void api.chapter.getById.prefetch({ courseId, chapterId });

  return (
    <>
      <HydrateClient>
        <PublishStatusBanner
          type="chapter"
          courseId={courseId}
          chapterId={chapterId}
        />
        <div className="px-2 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Link
                href={`/teacher/courses/${courseId}`}
                className="mb-6 flex items-center text-sm transition hover:opacity-75"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to course setup
              </Link>
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Chapter creation</h1>
                  <Suspense>
                    <CompletionIndecator
                      type="chapter"
                      courseId={courseId}
                      chapterId={chapterId}
                    />
                  </Suspense>
                </div>
                <ChapterActions initialData={{ chapterId, courseId }} />
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge
                    icon={LayoutDashboard}
                    size="sm"
                  />
                  <h2 className="text-xl">Cutomize your chapter</h2>
                </div>
                <ChapterTitleForm initialData={{ chapterId, courseId }} />
                <ChapterDescriptionForm initialData={{ chapterId, courseId }} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge
                    icon={Eye}
                    size="sm"
                  />
                  <h2 className="text-xl">Access settings</h2>
                </div>
                <ChapterAccessForm initialData={{ chapterId, courseId }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge
                  icon={Video}
                  size="sm"
                />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <ChapterVideoForm initialData={{ chapterId, courseId }} />
            </div>
          </div>
        </div>
      </HydrateClient>
    </>
  );
}
