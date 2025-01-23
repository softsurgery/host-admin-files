import React from "react";
import Files from "./components/Files/Files";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ path: "/", element: <Files /> }],
    },
  ],{
    basename: import.meta.env.VITE_HTACCESS_ORIGIN
  });

  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </React.Fragment>
  );
}
