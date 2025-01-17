import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { MenuContext } from "@/context/MenuContext";
import { useMenuSheet } from "./MenuSheet";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "@/context/BreadcrumbContext";
import React from "react";

interface LayoutProps {
  className?: string;
}

export default function Layout({ className }: LayoutProps) {
  //for menu provider
  const { MenuSheet, openMenu, closeMenu } = useMenuSheet({ side: "left" });
  const menuContextValue = {
    openMenu,
    closeMenu,
  };

  //for breadcrumb provider
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
  };

  return (
    <MenuContext.Provider value={menuContextValue}>
      <BreadcrumbContext.Provider value={breadcrumbContext}>
        <div
          className={cn(
            "min-h-screen max-h-screen flex flex-col flex-1 overflow-hidden",
            className
          )}
        >
          <Header routes={routes} />
          {MenuSheet}
          <main className="flex flex-col flex-1 overflow-hidden mx-10 lg:mx-24">
            <Outlet />
          </main>
        </div>
      </BreadcrumbContext.Provider>
    </MenuContext.Provider>
  );
}
