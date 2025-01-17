import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMenuContext } from "@/context/MenuContext";
import { BreadcrumbRoute } from "@/context/BreadcrumbContext";
import { BreadcrumbCommon } from "../common/Breadcrumb";

interface HeaderProps {
  className?: string;
  routes?: BreadcrumbRoute[];
}

export const Header: React.FC<HeaderProps> = ({ className, routes }) => {
  const { openMenu } = useMenuContext();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6",
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full ml-auto"
          >
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] mt-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
