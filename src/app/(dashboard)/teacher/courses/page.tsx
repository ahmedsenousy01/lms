import { getCurrentUser } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  void api.course.getByUserId.prefetch({
    userId: user!.id,
  });

  return (
    <HydrateClient>
      <div className="h-full p-6">
        <DataTable columns={columns} />
      </div>
    </HydrateClient>
  );
}
