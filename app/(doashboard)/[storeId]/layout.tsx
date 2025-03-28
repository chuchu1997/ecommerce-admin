import Navbar from "@/components/navbar";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;

  
}

export default async function DashboardLayout(props: LayoutProps) {
  const { children, params } = props;
  const { storeId } = await params; 
  console.log("STORE ID",storeId);

  const user = await getCurrentUser();

  const store = await prismadb.store.findFirst({
    where: { 
      id: storeId,
      userID: user?.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="wrapper-dashboard">
        <Navbar/>
      <div className = "min-h-screen container mx-auto mt-[10px]">{children}</div>
      <div>FOOTER</div>
    </div>
  );
}