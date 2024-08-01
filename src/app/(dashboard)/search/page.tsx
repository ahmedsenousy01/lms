import { api, HydrateClient } from "@/trpc/server";

import { Categories } from "./components/categories";

export default async function SearchPage() {
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="px-2 py-6 sm:px-6">
        <Categories />
      </div>
    </HydrateClient>
  );
}
