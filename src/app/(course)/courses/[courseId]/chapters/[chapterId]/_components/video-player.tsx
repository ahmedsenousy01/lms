"use client";

import { useState } from "react";

import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock, TriangleAlert } from "lucide-react";

import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  title: string;
  chapterId: string;
  courseId: string;
  playbackId: string;
  isLocked: boolean;
}

export function VideoPlayer({
  title,
  chapterId,
  courseId,
  playbackId,
  isLocked,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative aspect-video">
      {isLocked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="size-8" />
          <span className="text-sm">This chapter is locked.</span>
        </div>
      ) : (
        <>
          <MuxPlayer
            title={title}
            className={cn((!isReady || videoError) && "hidden")}
            playbackId={playbackId}
            onCanPlay={() => setIsReady(true)}
            onError={() => setVideoError(true)}
            autoPlay={true}
          />
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
              <Loader2 className="size-8 animate-spin" />
              <span className="text-sm">Loading video...</span>
            </div>
          )}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
              <TriangleAlert className="size-8" />
              <span className="text-sm">Error loading video</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
