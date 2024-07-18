"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "./user-button";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function NavbarRoutes() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");

  return (
    <div className="ml-auto flex items-center gap-x-2">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button
            size="sm"
            variant="ghost"
          >
            <LogOut className="mr-2 size-4" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button
            size="sm"
            variant="ghost"
          >
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
}
