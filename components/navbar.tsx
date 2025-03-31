

import { MainNav } from "@/components/main-navbar";
import StoreSwitcher from "@/components/store-switch";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";

const Navbar = async () => {

   const user = await getCurrentUser();
    const stores =await prismadb.store.findMany({
        where:{
            userID:user?.id
        }
    });
  return (
    <div className="border-b">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <StoreSwitcher items = {stores}></StoreSwitcher>
          <MainNav className="mx-8" />
          <div className="ml-auto hidden md:flex items-center space-x-4 ">
            <div>User Button</div>
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default Navbar;
