import { cn } from "@/lib/utils";
import SidebarNav from "../components/common/SidebarNav";
import { FileTextIcon, KeySquare, Orbit, Settings2 } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Outlet } from "react-router-dom";

interface DocumentManagementProps {
  className?: string;
}

export default function DocumentManagement({ className }: DocumentManagementProps) {
  //menu items
  const sidebarNavItems = [
    {
      title: "Workspaces",
      icon: <Orbit size={18} />,
      href: "/dms/workspaces",
    },
    {
      title: "Files",
      icon: <FileTextIcon size={18} />,
      href: "/dms/files",
    },
    {
      title: "API Keys",
      icon: <KeySquare size={18} />,
      href: "/dms/api-keys",
    },
    {
      title: "Preferences",
      icon: <Settings2 size={18} />,
      href: "/dms/preferences",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-hidden m-5 lg:mx-10",
        className
      )}
    >
      <div className="space-y-0.5 py-5 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Document Management System
        </h1>
        <p className="text-muted-foreground">
          A simple, easy to use, and fast document management system.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-col flex-1 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-[7] overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
