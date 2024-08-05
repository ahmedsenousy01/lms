"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";

import { useUpdateChapter } from "../_queries/use-update-chapter";

const schema = z.object({
  isFree: z.boolean().default(false),
});

export default function ChapterAccessForm({
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
      isFree: !!chapter?.isFree,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateChapter({
        chapter: {
          id: chapterId,
          isFree: values.isFree,
        },
        courseId,
      });
      setEditing(false);
      toast({
        description: "access settings updated",
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
              Chapter access
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
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      preview
                    </FormDescription>
                  </div>
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
          <p
            className={cn(
              "mt-2 text-sm text-sky-700",
              !chapter?.isFree && "italic text-slate-500"
            )}
          >
            {!!chapter?.isFree
              ? "This chapter is free for preview"
              : "This chapter is not free"}
          </p>
        </>
      )}
    </div>
  );
}
