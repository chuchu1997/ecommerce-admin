"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export const BillboardClient = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title="Billboards (0)"
          description={"Hình ảnh đại diện cho danh mục sản phẩm của Store () "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`${params.storeId}/billboards/new`)}
        >
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
    </>
  );
};
