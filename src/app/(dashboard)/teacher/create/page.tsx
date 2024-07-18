"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function CreateCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  function handleSubmit(values: z.infer<typeof schema>) {
    // TODO: Create course mutation
    try {
      throw new Error("Not implemented");
    } catch (error) {
      toast({
        title: "Error creating course",
        description: "Something went wrong",
        variant: "destructive",
      });
    }

    console.log(values);
    // const courseId = 1;
    // router.push(`/teacher/course/${courseId}`);
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to call your course? Don&apos;t worry, you can
          change it later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What would you like to teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
