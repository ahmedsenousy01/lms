"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { InferSelectModel } from "drizzle-orm";
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

import type { courses } from "@/server/db/schema";

import { cn, formatPrice } from "@/lib/utils";

import { useUpdateCourse } from "../queries/use-update-course";

const schema = z.object({
  price: z.coerce.number(),
});

export default function PriceForm({
  initialData: { id, price },
}: {
  initialData: InferSelectModel<typeof courses>;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const { data, mutateAsync: updateCourse } = useUpdateCourse({ id });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: data?.price ?? price ?? undefined,
    },
  });
  const { isValid, isSubmitting } = form.formState;

  async function handleSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCourse({
        id,
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
              !price && !data?.price && "italic text-slate-500"
            )}
          >
            {data?.price
              ? formatPrice(data.price)
              : price
                ? formatPrice(price)
                : "No price"}
          </p>
        </>
      )}
    </div>
  );
}
