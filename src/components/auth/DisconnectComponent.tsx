import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";
import React from "react";

export const DisconnectComponent = () => {
  const authPersistStore = useAuthPersistStore();
  React.useEffect(() => {
    authPersistStore.logout();
  }, []);
  return <React.Fragment></React.Fragment>;
};
