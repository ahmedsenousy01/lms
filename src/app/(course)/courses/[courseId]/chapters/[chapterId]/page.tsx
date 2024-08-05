import { FileIcon } from "lucide-react";

import { Banner } from "@/components/ui/banner";
import Preview from "@/components/ui/react-quill/preview";
import { Separator } from "@/components/ui/separator";

import { api } from "@/trpc/server";

import { CourseEnrollButton } from "./_components/course-enroll-button";
import { VideoPlayer } from "./_components/video-player";

export default async function ChapterPage({
  params: { chapterId, courseId },
}: {
  params: { chapterId: string; courseId: string };
}) {
  const [chapter, purchase, course] = await Promise.all([
    api.chapter.getById({ chapterId, courseId }),
    api.course.checkForCoursePurchase({ courseId }),
    api.course.watch({ courseId }),
  ]);

  const isLocked = !chapter.isFree && !purchase;
  const isCompleted = !!chapter.userProgress[0]?.isCompleted;

  return (
    <div>
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this chapter to access this chapter."
        />
      )}
      {isCompleted && (
        <Banner
          variant="success"
          label="You have completed this chapter."
        />
      )}
      <div className="mx-auto flex h-full max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            courseId={courseId}
            playbackId={chapter.muxPlaybackId!}
            title={chapter.title}
            isLocked={isLocked}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
            {purchase ? (
              <>course progress button</>
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!course.attachments?.length && (
            <>
              <Separator />
              <div className="max-h-80 space-y-2 overflow-y-auto p-4">
                {course.attachments.map(attachment => (
                  <a
                    href={attachment.url ?? "#"}
                    key={attachment.id}
                    target="_blank"
                    className="flex w-full items-center rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
                  >
                    <FileIcon className="size-4" />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
