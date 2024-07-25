"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signUpSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

export default function RegistrationPage() {
  const { mutateAsync: createUser } = api.user.create.useMutation();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    reValidateMode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      await createUser(values);
      toast({ title: "Account created successfully" });
      router.push("/auth/login");
    } catch (error) {
      setApiError((error as Error).message ?? "Unknown error");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
          {apiError && (
            <p className="text-sm font-medium text-destructive">{apiError} </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="max-w-[250px] break-words" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="max-w-[250px] break-words" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="max-w-[250px] break-words" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="max-w-[250px] break-words" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                >
                  Create an account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?
                <Link
                  className="ms-1 underline"
                  href="/auth/login"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
