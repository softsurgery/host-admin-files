import Files from "./components/Files/Files";
import Layout from "./components/layout/Layout";
import { useMenuSheet } from "./components/layout/MenuSheet";
import { MenuContext } from "./context/MenuContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Files /> },
      ],
    },
  ]);
  const { MenuSheet, openMenu, closeMenu } = useMenuSheet({ side: "left" });

  const menuContextValue = {
    openMenu,
    closeMenu,
  };

  return (
    <MenuContext.Provider value={menuContextValue}>
      {MenuSheet}      
      <RouterProvider router={router} />
    </MenuContext.Provider>
  );
}
