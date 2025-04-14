"use client";


import { ServiceColumn } from "./column";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import ActionDropdown from "@/components/action-dropdown";

interface CellActionProps {
  data: ServiceColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Copy Dịch vụ  ID Thành Công");
  };
  const onEdit = () => {
    router.push(`/${params.storeId}/services/${data.slug}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/services/${data.slug}`);

      router.refresh();
      toast.success("Xoá Dịch vụ thành công !!");
    } catch (err) {
      toast.error("Có lỗi ở đâu đó !! Vui lòng thử lại sau !!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onDelete();
          setOpen(false);
        }}
      />
   
     <ActionDropdown   
       onCopy={onCopy}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenDeleteModal={() => setOpen(true)}
        
        />


    </>
  );
};
