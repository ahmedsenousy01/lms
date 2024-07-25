"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

import type { Course } from "@/server/db/schema";

import { cn } from "@/lib/utils";

import { useUpdateCourse } from "../queries/use-update-course";

const schema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export default function CategoryForm({
  initialData: { id, categoryId },
  options,
}: {
  initialData: Course;
  options: { label: string; value: string }[];
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateCourse } = useUpdateCourse({ id });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: data?.categoryId ?? categoryId ?? "",
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id,
        categoryId: values.categoryId,
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

  const selectedOption = options.find(
    option => option.value === (data?.categoryId ?? categoryId)
  );

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course category
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit category
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
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
              !categoryId && !selectedOption && "italic text-slate-500"
            )}
          >
            {selectedOption?.label ?? "No category"}
          </p>
        </>
      )}
    </div>
  );
}
