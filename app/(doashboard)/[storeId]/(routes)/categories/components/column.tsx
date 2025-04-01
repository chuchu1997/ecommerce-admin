"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel?: string;
  createAt: string;
  billboardImageUrl:string;
  slug:string;


};

export const columns: ColumnDef<CategoryColumn>[] = [
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
    accessorKey: "billboardLabel",
    header: "Billboard Label",
    cell: ({ row }) => row.original.billboardLabel,
  },

  
  {
    accessorKey: "billboardImage",
    header: "Billboard Image",
   cell: ({ row }) => (
         <div className="relative w-[80px] h-[80px] ">
           <Image
             src={row.original.billboardImageUrl}
             fill
             className="object-cover rounded-xl"
             loading="eager" // ✅ Ensures images load immediately
             alt="image-product"></Image>
         </div>
       ),
  },
  {
    accessorKey: "createAt",
    header: "Date",
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
