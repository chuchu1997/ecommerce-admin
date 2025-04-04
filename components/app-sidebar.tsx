
"use client";

import {PackageSearchIcon, BookCopyIcon, BookMinusIcon, PaletteIcon, FileImageIcon,ChartSplineIcon ,ScalingIcon , SettingsIcon } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


import { Separator } from "@/components/ui/separator"

import { useParams, usePathname } from "next/navigation";
import AvatarButton from "./avatar-button";
 

 
export function AppSidebar() {
      const pathname = usePathname();
      const params = useParams();
    
    const routes = [
        {
          href: `/${params.storeId}`,
          label: "Tổng quan ",
          active: pathname === `/${params.storeId}`,
          icon: ChartSplineIcon,
        },
        {
          href: `/${params.storeId}/billboards`,
          label: "Quản lý Hình ảnh",
          active: pathname === `/${params.storeId}/billboards`,
          icon: FileImageIcon,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Quản lý Danh mục ",
            active: pathname === `/${params.storeId}/categories`,
            icon: BookMinusIcon,
          },
        {
          href: `/${params.storeId}/sub-categories`,
          label: "Quản lý Danh mục con",
          active: pathname === `/${params.storeId}/sub-categories`,
          icon: BookCopyIcon,
        },
      
        {
          href: `/${params.storeId}/sizes`,
          label: "Quản lý Kích thước (size)",
          active: pathname === `/${params.storeId}/sizes`,
          icon: ScalingIcon,
        },
        {
          href: `/${params.storeId}/colors`,
          label: "Quản lý Màu sắc (Sản phẩm vv...v)",
          active: pathname === `/${params.storeId}/sizes`,
          icon: PaletteIcon,
        },
    
        {
          href: `/${params.storeId}/products`,
          label: "Quản lý Sản phẩm ",
          active: pathname === `/${params.storeId}/products`,
          icon: PackageSearchIcon,
        },
        {
          href: `/${params.storeId}/settings`,
          label: "Cài đặt ",
          active: pathname === `/${params.storeId}/settings`,
          icon: SettingsIcon,
        },
      ];



  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Application (Store)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href} className = "py-1">
                  <SidebarMenuButton asChild>
                    <a href={route.href}>
                      <route.icon />
                      <span>{route.label}</span>
                    </a>
                  </SidebarMenuButton>
               
                </SidebarMenuItem>
                        
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />
        <AvatarButton className = "mx-4 bg-green-300"/>
        
      </SidebarContent>
    </Sidebar>
  )
}