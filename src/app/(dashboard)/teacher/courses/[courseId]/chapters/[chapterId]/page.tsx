import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { IconBadge } from "@/components/ui/icon-badge";

import { api } from "@/trpc/server";

import ChapterAccessForm from "./components/chapter-access-form";
import ChapterDescriptionForm from "./components/chapter-description-form";
import ChapterTitleForm from "./components/chapter-title-form";
import ChapterVideoForm from "./components/chapter-video-form";

export default async function CourseChapterPage({
  params: { courseId, chapterId },
}: {
  params: { courseId: string; chapterId: string };
}) {
  let chapter;
  try {
    chapter = await api.chapter.getById({ courseId, chapterId });
  } catch (error) {
    console.log(error);
    redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionString = `(${completedFields}/${totalFields})`;

  return (
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
              <span className="text-sm text-slate-700">
                Complete all fields {completionString}
              </span>
            </div>
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
            <ChapterTitleForm initialData={{ chapter, courseId }} />
            <ChapterDescriptionForm initialData={{ chapter, courseId }} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge
                icon={Eye}
                size="sm"
              />
              <h2 className="text-xl">Access settings</h2>
            </div>
            <ChapterAccessForm initialData={{ chapter, courseId }} />
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
          <ChapterVideoForm initialData={{ chapter, courseId }} />
        </div>
      </div>
    </div>
  );
}
