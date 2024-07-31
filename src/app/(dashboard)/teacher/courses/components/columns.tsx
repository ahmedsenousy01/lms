"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { type Course } from "@/server/db/schema";

import { cn } from "@/lib/utils";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "category.name",
    header: "Category",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const { price } = row.original;
      const floatPrice = parseFloat(price?.toString() ?? "0");
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(floatPrice);

      return <div>{price ? formattedPrice : "Not set"}</div>;
    },
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const { isPublished } = row.original;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id: courseId } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="size-4 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                href={`/teacher/courses/${courseId}`}
                className="flex w-full items-center"
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
