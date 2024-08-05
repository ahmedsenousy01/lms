"use client";

import { Button } from "@/components/ui/button";

export function CourseEnrollButton({
  courseId,
  price,
}: {
  courseId: string;
  price: number;
}) {
  return (
    <Button
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {price}
    </Button>
  );
}
