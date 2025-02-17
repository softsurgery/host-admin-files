import { useAuthPersistStore } from "@/hooks/stores/useAuthPersistStore";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DisconnectComponent = () => {
  const navigate = useNavigate();
  const authPersistStore = useAuthPersistStore();
  React.useEffect(() => {
    authPersistStore.logout();
    navigate("/");
  }, []);
  return <React.Fragment></React.Fragment>;
};
