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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import type { Chapter } from "@/server/db/schema";

import { useUpdateChapter } from "../queries/use-update-chapter";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function ChapterTitleForm({
  initialData: {
    chapter: { id, title },
    courseId,
  },
}: {
  initialData: { chapter: Chapter; courseId: string };
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateChapter } = useUpdateChapter({ id });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data?.title ?? title,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateChapter({
        chapter: {
          id,
          title: values.title,
        },
        courseId,
      });
      setEditing(false);
      toast({
        title: "Title updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error editing course",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter title
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit title
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
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
          <p className="mt-2 text-sm">{data?.title ?? title}</p>
        </>
      )}
    </div>
  );
}
