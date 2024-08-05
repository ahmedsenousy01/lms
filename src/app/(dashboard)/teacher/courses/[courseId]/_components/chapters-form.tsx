"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
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

import { useCreateChapter } from "../_queries/use-create-chapter";
import { useGetCourseDetails } from "../_queries/use-get-course-details";
import ChaptersList from "./chapters-list";

const schema = z.object({
  title: z.string().min(1, { message: "chapter title is required" }),
});

export default function ChaptersForm({ courseId }: { courseId: string }) {
  const [creating, setCreating] = useState<boolean>(false);
  const { mutateAsync: createChapter } = useCreateChapter({ courseId });
  const { data: course } = useGetCourseDetails({ courseId });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await createChapter({
        courseId,
        title: values.title,
      });
      setCreating(false);
      toast({
        description: "chapter created",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Error creating chapter",
        variant: "destructive",
      });
    }
  }

  const hasChapters = course!.chapters.length > 0;

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button
          onClick={() => setCreating(current => !current)}
          variant="ghost"
        >
          {creating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add chapter
            </>
          )}
        </Button>
      </div>
      {creating ? (
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
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <>
          {hasChapters ? (
            <div className="relative">
              <div className="max-h-52 space-y-4 overflow-y-auto">
                <ChaptersList
                  chapters={course?.chapters ?? []}
                  courseId={courseId}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm italic text-slate-500">
                No chapters yet
              </p>
            </>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Drag and drop to reorder chapters
          </p>
        </>
      )}
    </div>
  );
}
