"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

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
