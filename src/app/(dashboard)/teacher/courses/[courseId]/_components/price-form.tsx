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

import { cn, formatPrice } from "@/lib/utils";

import { useGetCourseDetails } from "../_queries/use-get-course-details";
import { useUpdateCourse } from "../_queries/use-update-course";

const schema = z.object({
  price: z.coerce.number(),
});

export default function PriceForm({ courseId }: { courseId: string }) {
  const [editing, setEditing] = useState<boolean>(false);
  const { mutateAsync: updateCourse } = useUpdateCourse({ courseId });
  const { data: course } = useGetCourseDetails({ courseId });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: course?.price ?? undefined,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id: courseId,
        price: values.price,
      });
      setEditing(false);
      toast({
        title: "price updated",
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
        Course price
        <Button
          onClick={() => setEditing(current => !current)}
          variant="ghost"
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit price
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="set a price for your course"
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
              !course?.price && "italic text-slate-500"
            )}
          >
            {course?.price ? formatPrice(course.price) : "No price"}
          </p>
        </>
      )}
    </div>
  );
}
