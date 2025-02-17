import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface UseDialogOptions {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  onToggle?: () => void;
}

interface UseDialogReturn {
  DialogFragment: React.ReactNode;
  openDialog: () => void;
  closeDialog: () => void;
}

export function useDialog({
  children,
  className = "",
  title,
  description,
  onToggle,
}: UseDialogOptions): UseDialogReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = (): void => setIsOpen(true);
  const closeDialog = (): void => setIsOpen(false);
  const onOpenChange = (b: boolean) => {
    setIsOpen(b);
    onToggle?.();
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const DialogFragment = ReactDOM.createPortal(
    <React.Fragment>
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className={cn(className)}>
            {title && description && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {children}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent className="my-5 px-2">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
          </DrawerContent>
        </Drawer>
      )}
    </React.Fragment>,
    document.body
  );

  return { DialogFragment, openDialog, closeDialog };
}
