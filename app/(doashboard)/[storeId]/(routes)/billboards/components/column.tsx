/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string;
  label: string;
  createAt: string;
  imageUrl: string;
  isActiveBanner: boolean;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },

  {
    accessorKey: "imageUrl",
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
    accessorKey: "isActiveBanner",
    header: "Is Banner",
  },

  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
