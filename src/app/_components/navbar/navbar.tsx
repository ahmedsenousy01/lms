import MobileSidebar from "./mobile-sidebar";
import { NavbarRoutes } from "./navbar-routes";

export default function Navbar() {
  return (
    <nav className="flex items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </nav>
  );
}
