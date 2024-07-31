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

import { useGetCourseDetails } from "../queries/use-get-course-details";
import { useUpdateCourse } from "../queries/use-update-course";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function TitleForm({ courseId }: { courseId: string }) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data: course } = useGetCourseDetails({ courseId });
  const { mutateAsync: updateCourse } = useUpdateCourse({ courseId });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: course?.title,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id: courseId,
        title: values.title,
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
        Course title
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
          <p className="mt-2 text-sm">{course?.title}</p>
        </>
      )}
    </div>
  );
}
