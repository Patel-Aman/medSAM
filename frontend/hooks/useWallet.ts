import { useState, useEffect } from "react";

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum?.request({
          method: "eth_requestAccounts",
        }) as string[];
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum?.request({
          method: "eth_accounts",
        }) as string[];
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    };

    checkWalletConnection();
  }, []);

  return { account, connectWallet };
};
