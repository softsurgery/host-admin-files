import React from "react";
import Files from "./components/Files/Files";
import Layout from "./components/layout/Layout";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import DMSMain from "./components/DMS/DMSMain";
import Page404 from "./components/common/Page404";
import ComingSoon from "./components/common/ComingSoon";
import { Workspaces } from "./components/DMS/Workspaces";

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/dms",
            element: <DMSMain />,
            children: [
              { path: "/dms", element: <Navigate to="/dms/workspaces" /> },
              { path: "/dms/workspaces", element: <Workspaces /> },
              { path: "/dms/api-keys", element: <ComingSoon /> },
              { path: "/dms/preferences", element: <ComingSoon /> },
            ],
          },
          { path: "/files", element: <Files /> },
          { path: "/test", element: <div>Test</div> },
        ],
      },
      { path: "*", element: <Page404 /> },
    ],
    {
      basename: import.meta.env.VITE_HTACCESS_ORIGIN,
    }
  );

  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </React.Fragment>
  );
}
