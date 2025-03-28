/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm = (props: SettingsFormProps) => {
  const { initialData } = props;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button variant="destructive" size="icon" onClick={() => {}}>
          <Trash className="w-4 h-4 "></Trash>
        </Button>
      </div>
    </div>
  );
};
