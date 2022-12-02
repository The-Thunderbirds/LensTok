import { useWalletProvider } from "../../context/WalletProvider";

function DisconnectWallet() {
  const { disconnect, isLoggedIn } = useWalletProvider()!;

  return (
    <div>
      {isLoggedIn &&
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={disconnect}
        >
          Disconnect Wallet
        </button>
      }
    </div>
  );
}

export default DisconnectWallet;