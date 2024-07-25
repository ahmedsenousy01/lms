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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import type { Course } from "@/server/db/schema";

import { cn } from "@/lib/utils";

import { useUpdateCourse } from "../queries/use-update-course";

const schema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export default function DescriptionForm({
  initialData: { id, description },
}: {
  initialData: Course;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateCourse } = useUpdateCourse({ id });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: data?.description ?? description ?? "",
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id,
        description: values.description,
      });
      setEditing(false);
      toast({
        description: "description updated",
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
        Course description
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
                    <Textarea
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
          <p
            className={cn(
              "mt-2 text-sm",
              !description && !data?.description && "italic text-slate-500"
            )}
          >
            {data?.description ?? description ?? "No description"}
          </p>
        </>
      )}
    </div>
  );
}
