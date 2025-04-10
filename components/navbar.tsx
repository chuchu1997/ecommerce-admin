


import { MainNav } from "@/components/main-navbar";
import StoreSwitcher from "@/components/store-switch";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import AvatarButton from "./avatar-button";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = async () => {

   const user = await getCurrentUser();
    const stores =await prismadb.store.findMany({
        where:{
            userID:user?.id
        }
    });
  return (
    <div className="">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">

          <div className = "flex gap-x-4">
          <SidebarTrigger />
          <StoreSwitcher items = {stores}></StoreSwitcher>
  
          </div>
       

          {/* <MainNav className="mx-8" /> */}
          {/* <AvatarButton className = "hidden md:block" /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
