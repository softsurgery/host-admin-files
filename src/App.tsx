import Files from "./components/Files/Files";
import { Header } from "./components/layout/Header";
import { useMenuSheet } from "./components/layout/MenuSheet";
import { MenuContext } from "./context/MenuContext";
export default function App() {
  const { MenuSheet, openMenu, closeMenu } = useMenuSheet({ side: "left" });

  const menuContextValue = {
    openMenu,
    closeMenu,
  };

  return (
    <MenuContext.Provider value={menuContextValue}>
      {MenuSheet}
      <Header />
      <Files />
    </MenuContext.Provider>
  );
}
