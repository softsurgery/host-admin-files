import {
  Book,
  Bot,
  Code2,
  LifeBuoy,
  Settings2,
  SquareTerminal,
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
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "@/context/BreadcrumbContext";
import React from "react";
import { cn } from "@/lib/utils";

export const description =
  "An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages.";

interface LayoutProps {
  className?: string;
}

export default function Layout({ className }: LayoutProps) {
  //for breadcrumb provider
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const breadcrumbContext = {
    routes,
    setRoutes,
  };
  const version = "0.0.1-beta";

  return (
    <BreadcrumbContext.Provider value={breadcrumbContext}>
      <div
        className={cn(
          "min-h-screen max-h-screen flex flex-col flex-1 overflow-hidden",
          className
        )}
      >
        <div className="grid h-screen w-full pl-[56px]">
          <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
              <Button variant="outline" size="icon" aria-label="Home">
                <Triangle className="size-5 fill-foreground" />
              </Button>
            </div>
            <nav className="grid gap-1 p-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg bg-muted"
                      aria-label="Playground"
                    >
                      <SquareTerminal className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Playground
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Models"
                    >
                      <Bot className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Models
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="API"
                    >
                      <Code2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    API
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Documentation"
                    >
                      <Book className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Documentation
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Settings"
                    >
                      <Settings2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Settings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-auto rounded-lg"
                      aria-label="Help"
                    >
                      <LifeBuoy className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Help
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-auto rounded-lg"
                      aria-label="Account"
                    >
                      <SquareUser className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Account
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </aside>
          <div className="flex flex-col flex-1 min-h-screen max-h-screen">
            <Header routes={routes} />
            <main className="grid flex-1 gap-4 overflow-auto">
              <Outlet />
            </main>
              <p className="text-xs border ml-auto p-0.5 w-fit">{version}</p>
          </div>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
}
