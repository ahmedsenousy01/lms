import { getUserCourses } from "@/server/api/data-access/course";
import { getCurrentUser } from "@/server/auth";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const myCourses = await getUserCourses({
    userId: user!.id,
    with: {
      category: true,
    },
  });

  return (
    <div className="h-full p-6">
      <DataTable
        data={myCourses}
        columns={columns}
      />
    </div>
  );
}
