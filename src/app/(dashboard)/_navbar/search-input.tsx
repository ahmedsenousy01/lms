"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SearchIcon } from "lucide-react";
import qs from "query-string";

import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/use-debounce";

export function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [currentCategoryId, debouncedValue, router, pathname]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-3 size-4 text-slate-600" />
      <Input
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-72"
        placeholder="Search for a course"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
