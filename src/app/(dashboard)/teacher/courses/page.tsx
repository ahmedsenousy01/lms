import { getCurrentUser } from "@/server/auth";
import { api } from "@/trpc/server";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const courses = await api.course.getByUserId({
    userId: user!.id,
  });

  return (
    <div className="h-full p-6">
      <DataTable
        columns={columns}
        data={courses}
      />
    </div>
  );
}
