import Files from "./components/Files/Files";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ path: "/", element: <Files /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}
