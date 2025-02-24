import React from "react";
import Files from "./components/DMS/Files/Files";
import Layout from "./components/layout/Layout";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import DocumentManagement from "./pages/DocumentManagement";
import Page404 from "./components/common/Page404";
import ComingSoon from "./components/common/ComingSoon";
import { Workspaces } from "./pages/Workspaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/Auth";
import { DisconnectComponent } from "./components/auth/DisconnectComponent";
import { useAuthPersistStore } from "./hooks/stores/useAuthPersistStore";
import { WorspaceDetails } from "./components/DMS/Workspaces/WorspaceDetails";
import { Toaster } from "@/components/ui/sonner";
import { FilesMain } from "./pages/Files";

const queryClient = new QueryClient();
export default function App() {
  const { theme } = useTheme();
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/dms",
            element: <DocumentManagement />,
            children: [
              { path: "/dms", element: <Navigate to="/dms/workspaces" /> },
              { path: "/dms/workspaces", element: <Workspaces /> },
              { path: "/dms/workspaces/:id", element: <WorspaceDetails /> },
              { path: "/dms/files", element: <FilesMain /> },
              { path: "/dms/api-keys", element: <ComingSoon /> },
              { path: "/dms/preferences", element: <ComingSoon /> },
            ],
          },
          { path: "/test", element: <div>Test</div> },
        ],
      },
      { path: "/disconnect", element: <DisconnectComponent /> },
      { path: "*", element: <Page404 /> },
    ],
    {
      basename: import.meta.env.VITE_HTACCESS_ORIGIN,
    }
  );
  const authPersistStore = useAuthPersistStore();
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {!authPersistStore.isAuthenticated ? (
            <Auth />
          ) : (
            <RouterProvider router={router} />
          )}
          <Toaster theme={theme == "dark" ? "dark" : "light"} />
        </ThemeProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}
