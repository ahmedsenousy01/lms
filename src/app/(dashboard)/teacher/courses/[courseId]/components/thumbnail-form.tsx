"use client";

import { useState } from "react";

import Image from "next/image";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/components/ui/use-toast";

import type { Course } from "@/server/db/schema";

import { useUpdateCourse } from "../queries/use-update-course";

const schema = z.object({
  imageUrl: z.string().url().min(1, { message: "imageUrl is required" }),
});

export default function ThumbnailForm({
  initialData: { id, imageUrl },
}: {
  initialData: Course;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateCourse } = useUpdateCourse({ id });

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id,
        imageUrl: values.imageUrl,
      });
      setEditing(false);
      toast({
        description: "thumbnail updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Error editing course",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course thumbnail
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (imageUrl ?? data?.imageUrl) ? (
            <>
              <Pencil className="mr-2 size-4" />
              Edit thumbnail
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Upload thumbnail
            </>
          )}
        </Button>
      </div>
      {editing ? (
        <>
          <FileUploader
            endpoint="courseThumbnail"
            onChange={async url => {
              if (url) await handleSubmit({ imageUrl: url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </>
      ) : (imageUrl ?? data?.imageUrl) ? (
        <>
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Course thumbnail"
              src={imageUrl ?? data?.imageUrl ?? ""}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="size-10 text-slate-500" />
          </div>
        </>
      )}
    </div>
  );
}
