import React from "react";

export type BreadcrumbRoute = { title: string; href?: string };

interface BreadcrumbContextProps {
  routes?: BreadcrumbRoute[];
  setRoutes?: (routes: BreadcrumbRoute[]) => void;
}

export const BreadcrumbContext = React.createContext<BreadcrumbContextProps>(
  {}
);

export const useBreadcrumb = () => React.useContext(BreadcrumbContext);
