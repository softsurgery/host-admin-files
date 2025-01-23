import React from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbRoute } from "@/context/BreadcrumbContext";
import { ModeToggle } from "../common/ModeToggle";
import { BreadcrumbCommon } from "../common/Breadcrumb";

interface HeaderProps {
  className?: string;
  routes?: BreadcrumbRoute[];
}

export const Header: React.FC<HeaderProps> = ({ className, routes }) => {
  return (
    <header
      className={cn(
        (className =
          "sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 w-full"),
        className
      )}
    >
      {/* Right Section */}
      <div className="flex items-center justify-between w-full">
        <BreadcrumbCommon routes={routes} />
        <ModeToggle />
      </div>
    </header>
  );
};
