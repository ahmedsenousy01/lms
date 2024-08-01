import { api, HydrateClient } from "@/trpc/server";

import { SearchInput } from "../_navbar/search-input";
import { Categories } from "./components/categories";
import { CoursesList } from "./components/courses-list";

export default async function SearchPage({
  params: { categoryId, title },
}: {
  params: { categoryId?: string; title?: string };
}) {
  void api.category.getAll.prefetch();
  void api.course.browse.prefetch({ title, categoryId });

  return (
    <HydrateClient>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="space-y-4 px-2 py-6 sm:px-6">
        <Categories />
        <CoursesList />
      </div>
    </HydrateClient>
  );
}
