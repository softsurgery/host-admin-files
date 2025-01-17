import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  className?: string;
}

export default function Layout({ className }: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen max-h-screen flex flex-col flex-1 overflow-hidden",
        className
      )}
    >
      <Header />
      <main className="flex flex-col flex-1 overflow-hidden mx-10 lg:mx-24">
        <Outlet />
      </main>
    </div>
  );
}
