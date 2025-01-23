import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [val, setVal] = useState(location.pathname ?? "/settings");

  const handleSelect = (e: string) => {
    setVal(e);
    navigate(e);
  };

  return (
    <>
      <div className="md:hidden p-1">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden w-full overflow-x-auto bg-background py-2 md:block">
        <nav
          className={cn(
            "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            className
          )}
          {...props}
        >
          {items.map((item) => {
            return (
              <Button
                variant={"link"}
                key={item.href}
                onClick={() => handleSelect(item.href)}
                className={cn(
                  location.pathname === item.href
                    ? "bg-slate-300 dark:bg-gray-700"
                    : "hover:underline",
                  "justify-start"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
