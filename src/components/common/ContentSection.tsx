import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface ContentSectionProps {
  className?: string;
  childrenClassName?: string;
  title: string;
  desc: string;
  children?: JSX.Element;
}

export default function ContentSection({
  className,
  childrenClassName,
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div>
      <div className={cn("flex flex-col overflow-hidden", className)}>
        <div>
          <div className="flex-none">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        </div>

        {children && (
          <div
            className={cn(
              "faded-bottom flex flex-col flex-1 px-4 py-2",
              childrenClassName
            )}
          >
            {children}
          </div>
        )}
      </div>
      <Separator className="mt-4 flex-none" />
    </div>
  );
}
