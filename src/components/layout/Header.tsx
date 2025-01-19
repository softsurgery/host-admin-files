import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMenuContext } from "@/context/MenuContext";
import { BreadcrumbRoute } from "@/context/BreadcrumbContext";
import { BreadcrumbCommon } from "../common/Breadcrumb";
import { AccountDropdown } from "./AccountDropdown";

interface HeaderProps {
  className?: string;
  routes?: BreadcrumbRoute[];
}

export const Header: React.FC<HeaderProps> = ({ className, routes }) => {
  const { openMenu } = useMenuContext();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background px-4 sm:px-6",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant={"ghost"} size="icon" onClick={openMenu}>
          <Menu />
        </Button>
        <BreadcrumbCommon hierarchy={routes} />
      </div>

      {/* Right Section */}
      <AccountDropdown />
    </header>
  );
};
