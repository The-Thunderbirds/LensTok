import { useState } from "react";
import { useWalletProvider } from "../../context/WalletProvider";
function ConnectWallet() {
  const { smartAccountAddress, connect, isLoggedIn, loading } = useWalletProvider()!;

  const [isVisible, setIsVisible] = useState(false);

  // TODO: Use it to show details about profile
  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);


  return (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"   onClick={isLoggedIn ? showModal : connect}>
        {isLoggedIn && smartAccountAddress
          ? `${smartAccountAddress?.slice(0, 6)}...${smartAccountAddress?.slice(
              -6
            )}`
          : loading
          ? "setting up your wallet..."
          : "Connect Wallet"}
      </button>
  );
}

export default ConnectWallet;
