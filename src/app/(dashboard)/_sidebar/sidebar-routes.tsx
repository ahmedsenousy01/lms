"use client";
import { Compass, Layout } from "lucide-react";
import SidebarItem from "./sidebar-item";

const DummyRoutes = [
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

export default function SidebarRoutes({
  sheetCloseRef,
}: {
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}) {
  const routes = DummyRoutes;
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
