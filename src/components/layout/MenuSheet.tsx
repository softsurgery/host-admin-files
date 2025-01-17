import { FolderUp } from "lucide-react";
import { SheetSide, useSheet } from "../common/Sheet";
import { cn } from "@/lib/utils";

interface MenuSheetProps {
  className?: string;
  side?: SheetSide;
}

export const useMenuSheet = ({ className, side }: MenuSheetProps = {}) => {
  const {
    SheetFragment: MenuSheet,
    openSheet: openMenu,
    closeSheet: closeMenu,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <FolderUp />
        <h1 className="text-xl font-semibold">File Manager</h1>
      </div>
    ),
    description: "hello guys",
    children: <div></div>,
    className: cn("min-w-[20vw]", className),
    side,
  });

  return {
    MenuSheet,
    openMenu,
    closeMenu,
  };
};
