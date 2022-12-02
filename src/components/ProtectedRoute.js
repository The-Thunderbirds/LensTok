import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useWalletProvider } from "~/context/WalletProvider";
export const ProtectedRoute = ({ isLoggedIn, redirectPath = "/", children }) => {

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
