"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}
export const CategoryClient = (props: CategoryClientProps) => {
  const { data } = props;

  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Sub Categories(${data?.length || 0})`}
          description={"Hình ảnh Sub Categories trong Store  "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/sub-categories/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data}></DataTable>
      <Heading title={"API"} description={"API Call for billboards"} />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoriesId" />
    </>
  );
};
