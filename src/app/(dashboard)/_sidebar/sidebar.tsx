import { Logo } from "@/components/ui/logo";
import SidebarRoutes from "./sidebar-routes";

export default function Sidebar({
  sheetCloseRef,
}: {
  sheetCloseRef?: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <div className="z-50 h-full min-w-[250px] flex-col overflow-y-auto border-r bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <SidebarRoutes sheetCloseRef={sheetCloseRef} />
    </div>
  );
}
