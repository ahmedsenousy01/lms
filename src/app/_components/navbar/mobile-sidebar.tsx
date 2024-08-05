"use client";

import { useRef } from "react";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "../sidebar/sidebar";

export default function MobileSidebar() {
  const ref = useRef<HTMLButtonElement>(null); // TODO: move this to a global store (context or zustand)
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-white p-0"
      >
        <Sidebar sheetCloseRef={ref} />
      </SheetContent>
      <SheetClose ref={ref} />
    </Sheet>
  );
}
