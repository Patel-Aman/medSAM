"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Top Bar with Wallet Connect */}
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div />
        <Button
          label={walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          onClick={connectWallet}
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-grow flex-col justify-center items-center space-y-8">
        <Button label="Create New NFT" onClick={() => router.push("/create-nft")} />
        <Button label="See My NFTs" onClick={() => router.push("/my-nfts")} />
        <Button label="See All NFTs" onClick={() => router.push("/show-nfts")} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200 text-gray-600">
        © 2025 NFT Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
