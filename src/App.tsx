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
import { Workspaces } from "./components/DMS/Workspaces/Workspaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/Auth";
import { DisconnectComponent } from "./components/auth/DisconnectComponent";
import { useAuthPersistStore } from "./hooks/stores/useAuthPersistStore";
import { WorspaceDetails } from "./components/DMS/Workspaces/WorspaceDetails";

const queryClient = new QueryClient();
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
              { path: "/dms/workspaces/:id", element: <WorspaceDetails /> },
              { path: "/dms/api-keys", element: <ComingSoon /> },
              { path: "/dms/preferences", element: <ComingSoon /> },
            ],
          },
          { path: "/files", element: <Files /> },
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
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}
