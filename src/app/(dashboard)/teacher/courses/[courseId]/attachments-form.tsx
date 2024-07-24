"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { InferSelectModel } from "drizzle-orm";
import { File, PlusCircle, Trash } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/components/ui/use-toast";

import type { attachments, courses } from "@/server/db/schema";

import { useAddAttachment } from "./queries/use-add-attachment";
import { useDeleteAttachment } from "./queries/use-delete-attachment";

const schema = z.object({
  url: z.string().url().min(1, { message: "url is required" }),
});

export default function AttachmentsForm({
  initialData: { id, courseAttachments },
}: {
  initialData: InferSelectModel<typeof courses> & {
    courseAttachments: (InferSelectModel<typeof attachments> | null)[];
  };
}) {
  console.log(courseAttachments);
  const router = useRouter();
  const [editing, setEditing] = useState<boolean>(false);
  const { mutateAsync: addAttachment } = useAddAttachment({ id });
  const { mutateAsync: deleteAttachment } = useDeleteAttachment({ id });

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await addAttachment({
        url: values.url,
        courseId: id,
      });
      setEditing(false);
      toast({
        description: "Attachments updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Error editing course",
        variant: "destructive",
      });
    } finally {
      router.refresh();
    }
  }

  async function handleDelete({ attachmentId }: { attachmentId: string }) {
    try {
      await deleteAttachment({
        id: attachmentId,
        courseId: id,
      });
      setEditing(false);
      toast({
        description: "Attachment deleted",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Error deleting attachment",
        variant: "destructive",
      });
    } finally {
      router.refresh();
    }
  }

  const hasAttachments = courseAttachments.length > 0;

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Attachments
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add Attachments
            </>
          )}
        </Button>
      </div>
      {editing ? (
        <>
          <FileUploader
            endpoint="courseAttachment"
            onChange={async url => {
              if (url) await handleSubmit({ url });
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </>
      ) : hasAttachments ? (
        <>
          <div className="max-h-44 space-y-2 overflow-y-auto">
            {courseAttachments.map(attachment => (
              <div
                key={attachment?.id}
                className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 px-3 py-1 text-sky-700"
              >
                <File className="mr-2 size-6" />
                <p className="truncate">{attachment?.name}</p>
                <Button
                  variant="ghost"
                  className="ml-auto px-2 py-1"
                  onClick={async () =>
                    await handleDelete({
                      attachmentId: attachment!.id,
                    })
                  }
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm italic text-slate-500">
            No attachments added yet
          </p>
        </>
      )}
    </div>
  );
}
