"use client";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/hooks/auth/useAuth";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  // useEffect(() => {
  //   if (!isOpen) {
  //     onOpen();
  //   }
  // }, [isOpen, onOpen]);

  return <div className="p-4">ROOT PAGE</div>;
}
