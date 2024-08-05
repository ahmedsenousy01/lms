import Navbar from "../_components/navbar/navbar";
import Sidebar from "../_components/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid h-full md:grid-cols-[auto,1fr]">
      <aside className="hidden h-full md:flex">
        <Sidebar />
      </aside>
      <div className="grid h-screen grid-rows-[auto,1fr]">
        <Navbar />
        <div className="overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}
