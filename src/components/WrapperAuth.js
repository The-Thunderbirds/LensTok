import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useWalletProvider} from "~/context/WalletProvider";
function WrapperAuth({ children }) {
  const { smartAccountAddress, connect, isLoggedIn, loading } = useWalletProvider();
  const navigate = useNavigate();

  const handleToLogin = () => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  };

  return <div onClick={handleToLogin}>{children}</div>;
}

export default WrapperAuth;
