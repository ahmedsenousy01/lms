"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Editor from "@/components/ui/react-quill/editor";
import Preview from "@/components/ui/react-quill/preview";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";

import { useUpdateChapter } from "../queries/use-update-chapter";

const schema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export default function ChapterDescriptionForm({
  initialData: { chapterId, courseId },
}: {
  initialData: { chapterId: string; courseId: string };
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { mutateAsync: updateChapter } = useUpdateChapter({
    chapterId,
    courseId,
  });
  const [chapter] = api.chapter.getById.useSuspenseQuery({
    chapterId,
    courseId,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: chapter?.description ?? undefined,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateChapter({
        chapter: {
          id: chapterId,
          description: values.description,
        },
        courseId,
      });
      setEditing(false);
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
        Chapter description
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {editing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={cn(
              "mt-2 text-sm",
              !chapter?.description && "italic text-slate-500"
            )}
          >
            {chapter?.description ? (
              <Preview value={chapter?.description ?? ""} />
            ) : (
              "No description"
            )}
          </div>
        </>
      )}
    </div>
  );
}
