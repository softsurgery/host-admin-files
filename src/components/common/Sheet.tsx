import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type SheetSide = "top" | "right" | "bottom" | "left";

interface UseSheetOptions {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  side?: SheetSide;
  className?: string;
  onToggle?: () => void;
}

interface UseSheetReturn {
  SheetFragment: React.ReactNode;
  openSheet: () => void;
  closeSheet: () => void;
}

export function useSheet({
  children,
  className = "",
  title,
  description,
  side,
  onToggle,
}: UseSheetOptions): UseSheetReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openSheet = (): void => setIsOpen(true);
  const closeSheet = (): void => setIsOpen(false);
  const onOpenChange = (b: boolean) => {
    setIsOpen(b);
    onToggle?.();
  };

  const isDesktop = useMediaQuery("(min-width: 1500px)");
  const suitableSide = side ? side : isDesktop ? "right" : "bottom";

  const SheetFragment = ReactDOM.createPortal(
    <React.Fragment>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side={suitableSide}
          className={cn(
            "max-h-screen h-full flex flex-col overflow-hidden",
            className
          )}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-auto">{children}</div>
        </SheetContent>
      </Sheet>
    </React.Fragment>,
    document.body
  );

  return { SheetFragment, openSheet, closeSheet };
}
