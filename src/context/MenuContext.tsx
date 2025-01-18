import React from "react";

interface MenuContextProps {
  openMenu?: () => void;
  closeMenu?: () => void;
}

export const MenuContext = React.createContext<MenuContextProps>({});

export const useMenuContext = () => React.useContext(MenuContext);
