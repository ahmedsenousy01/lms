import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
}
