import { api, HydrateClient } from "@/trpc/server";

import { SearchInput } from "../_navbar/search-input";
import { Categories } from "./components/categories";

export default async function SearchPage() {
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="px-2 py-6 sm:px-6">
        <Categories />
      </div>
    </HydrateClient>
  );
}
