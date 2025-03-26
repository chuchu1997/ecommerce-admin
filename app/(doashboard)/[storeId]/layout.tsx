import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  //   const userID = null;
  //   if (!userID) {
  //     redirect("/sign-in");
  //   }

  //   const store = await prismadb.store.findFirst({
  //     where: {
  //       id: params.storeId,
  //       userID,
  //     },
  //   });

  //   if (!store) {
  //     redirect("/");
  //   }
  return (
    <div className="wrapper-dashboard">
      <div>THIS IS NAVBAR</div>
      <div>MAIN BODY</div>
      <div>FOOTER</div>
    </div>
  );
}
