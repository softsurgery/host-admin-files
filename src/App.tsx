import React from "react";
import Files from "./components/Files/Files";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ path: "/", element: <Files /> }],
    },
  ]);

  return (
    <React.Fragment>
      <RouterProvider router={router} />
      <Toaster />
    </React.Fragment>
  );
}
