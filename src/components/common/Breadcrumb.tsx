import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { SquareSlash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbCommonProps {
  className?: string;
  routes?: { title: string; href?: string }[];
}

export const BreadcrumbCommon = ({
  className,
  routes,
}: BreadcrumbCommonProps) => {
  const navigate = useNavigate();
  const lastIndex = routes ? routes.length - 1 : 0;

  return (
    <Breadcrumb className={cn(className, "my-auto")} aria-label="breadcrumb">
      <BreadcrumbList className="flex flex-wrap gap-1 sm:gap-2 items-center">
        {routes?.map((item, index) => (
          <BreadcrumbItem
            key={index}
            className="flex items-center gap-1 sm:gap-2"
          >
            {item.href ? (
              <BreadcrumbLink
                className={cn(
                  "font-medium text-xs",
                  item.href ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => {
                  if (item.href) navigate(item.href);
                }}
              >
                {item.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-medium text-xs sm:text-sm md:text-base">
                {item.title}
              </BreadcrumbPage>
            )}
            {index != lastIndex && (
              <SquareSlash className={cn("w-5 h-5", "text-gray-400")} />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
