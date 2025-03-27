"use client";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/hooks/auth/useAuth";
import { useStoreModal } from "@/hooks/use-store-modal";
import useAuthStore from "@/providers/auth/auth-provider";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);


  useEffect(()=>{
      console.log("THIS IS SETUP PAGE CALL !!");
  })


  // useEffect(() => {
  //   if (!isOpen) {
  //     onOpen();
  //   }
  // }, [isOpen, onOpen]);

  return <div className="p-4">THIS IS PROTECTED PAGE </div>;
}
