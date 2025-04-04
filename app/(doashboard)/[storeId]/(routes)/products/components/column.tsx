/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  imageUrl: string;
  name: string;
  isFeatured: boolean;
  isArchieved: boolean;
  sku: string;
  category: string;
  price: number;
  slug: string;
  subCategory: string;
  stock: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row.original.slug,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative w-[80px] h-[80px] ">
        <Image
          src={row.original.imageUrl}
          fill
          className="object-cover rounded-xl"
          loading="eager" // ✅ Ensures images load immediately
          alt="image-product"></Image>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.category}</div>
    ),
  },

  {
    accessorKey: "subCategory",
    header: "SubCategory",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.subCategory}</div>
    ),
  },

  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.original.sku,
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => row.original.price,
  },

  {
    accessorKey: "isFeatured",
    header: "IsFeatured",
  },

  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
