import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { type IconType } from "react-icons";

import { type Category } from "@/server/db/schema";

import { cn } from "@/lib/utils";

export function CategoryItem({
  category,
  icon: Icon,
}: {
  category: {
    id: Category["id"];
    name: Category["name"];
  };
  icon: IconType | undefined;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === category.id;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? undefined : category.id,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      className={cn(
        "flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-sky-700",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon className="size-4" />}
      <span className="line-clamp-1 truncate text-sm font-medium">
        {category.name}
      </span>
    </button>
  );
}
