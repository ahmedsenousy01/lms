import { type ColumnDef } from "@tanstack/react-table";

import { getCurrentUser } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  void api.course.getByUserId.prefetch({
    userId: user!.id,
  });

  return (
    <HydrateClient>
      <div className="h-full p-6">
        <DataTable columns={columns as ColumnDef<unknown>[]} />
      </div>
    </HydrateClient>
  );
}
