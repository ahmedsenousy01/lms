"use client";

import { useState } from "react";

import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/components/ui/use-toast";

import type { Chapter } from "@/server/db/schema";

import { useUpdateChapter } from "../queries/use-update-chapter";

const schema = z.object({
  videoUrl: z.string().url().min(1, { message: "videoUrl is required" }),
});

export default function ChapterVideoForm({
  initialData: {
    chapter: { id, videoUrl, muxPlaybackId },
    courseId,
  },
}: {
  initialData: { chapter: Chapter; courseId: string };
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateChapter } = useUpdateChapter({ id });

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateChapter({
        chapter: {
          id,
          videoUrl: values.videoUrl,
        },
        courseId,
      });
      setEditing(false);
      toast({
        description: "video updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Error editing chapter",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (videoUrl ?? data?.videoUrl) ? (
            <>
              <Pencil className="mr-2 size-4" />
              Edit video
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Upload video
            </>
          )}
        </Button>
      </div>
      {editing ? (
        <>
          <FileUploader
            endpoint="chapterVideo"
            onChange={async url => {
              if (url) await handleSubmit({ videoUrl: url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </>
      ) : (videoUrl ?? data?.videoUrl) ? (
        <>
          <div className="relative mt-2 aspect-video">
            <MuxPlayer
              streamType="on-demand"
              playbackId={data?.muxPlaybackId ?? muxPlaybackId ?? ""}
            />
            <p className="text-sm text-muted-foreground">
              Videos can take a few minutes to process. Refresh the page if the
              video doesn&apos;t appear.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <VideoIcon className="size-10 text-slate-500" />
          </div>
        </>
      )}
    </div>
  );
}
