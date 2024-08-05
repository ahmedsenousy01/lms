"use client";

import { usePathname } from "next/navigation";

import { BarChart, Compass, Layout, List } from "lucide-react";

import SidebarItem from "./sidebar-item";

const GuestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const TeacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export default function SidebarRoutes({
  sheetCloseRef,
}: {
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}) {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? TeacherRoutes : GuestRoutes;

  return (
    <div className="flex w-full flex-col">
      {routes.map(route => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          sheetCloseRef={sheetCloseRef}
        />
      ))}
    </div>
  );
}
