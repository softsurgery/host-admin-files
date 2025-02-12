import {
  File,
  FlaskConical,
  LifeBuoy,
  LucideProps,
  Paperclip,
  SquareUser,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "@/context/BreadcrumbContext";
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

interface MenuItem {
  id: number;
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export default function Layout({ className }: LayoutProps) {
  //navigate
  const navigate = useNavigate();
  const location = useLocation();

  //for breadcrumb provider
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
  };

  const version = "0.0.1-beta";

  const aItems: MenuItem[] = [
    { id: 1, label: "D.M.S", href: "/dms", icon: Paperclip },
    { id: 2, label: "Files", href: "/files", icon: File },
    { id: 3, label: "Test", href: "/test", icon: FlaskConical },
  ];
  const bItems: MenuItem[] = [
    { id: 1, label: "Help", href: "/help", icon: LifeBuoy },
    { id: 2, label: "Account", href: "/account", icon: SquareUser },
  ];

  const itemMapper = (items: MenuItem[]) => {
    return items.map((item) => (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-lg",
              item.href == location.pathname ? "bg-muted" : ""
            )}
            aria-label={item.label}
            onClick={() => navigate(item.href)}
          >
            <item.icon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={5}
          className="font-bold text-xs"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    ));
  };

  return (
    <BreadcrumbContext.Provider value={breadcrumbContext}>
      <div
        className={cn(
          "min-h-screen max-h-screen flex flex-col flex-1 overflow-hidden",
          className
        )}
      >
        <div className="flex flex-col flex-1 overflow-hidden min-h-screen max-h-screen pl-[56px]">
          <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
              <Button variant="outline" size="icon" aria-label="Home">
                <Triangle className="size-5 fill-foreground" />
              </Button>
            </div>
            <nav className="grid gap-1 p-2">
              <TooltipProvider>{itemMapper(aItems)}</TooltipProvider>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
              <TooltipProvider>{itemMapper(bItems)}</TooltipProvider>
            </nav>
          </aside>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div>
              <Header routes={routes} />
            </div>
            <main className="flex flex-col flex-1 overflow-hidden gap-4">
              <Outlet />
            </main>
            <p className="text-xs border ml-auto p-0.5 w-fit">{version}</p>
          </div>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
}
