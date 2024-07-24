"use client";

import { usePathname, useRouter } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  sheetCloseRef,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
    sheetCloseRef?.current?.click();
  };

  const isActive =
    pathname === href ||
    pathname?.startsWith(href + "/") ||
    (pathname === "/" && href === "/");

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        isActive &&
          "bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={isActive ? 24 : 22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        <span className={cn("text-sm", isActive && "text-[0.9rem] font-[600]")}>
          {label}
        </span>
      </div>
    </button>
  );
}
