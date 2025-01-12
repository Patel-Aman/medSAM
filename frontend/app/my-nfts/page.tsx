"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import NFTCard from "@/components/NFTCard";

type NFT = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

const MyNFTs: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]); // State to store NFTs
  const router = useRouter();

  useEffect(() => {
    // Mock data for now. Replace this with a real API or blockchain call.
    const mockNFTs: NFT[] = [
      {
        id: 1,
        name: "NFT 1",
        description: "Description for NFT 1",
        imageUrl: "/assets/nft1.jpg",
        price: "1.5 ETH",
      },
      {
        id: 2,
        name: "NFT 2",
        description: "Description for NFT 2",
        imageUrl: "/assets/nft2.jpg",
        price: "2.0 ETH",
      },
      {
        id: 3,
        name: "NFT 3",
        description: "Description for NFT 3",
        imageUrl: "/assets/nft3.jpg",
        price: "0.8 ETH",
      },
    ];

    setNfts(mockNFTs); // Set the mock NFT data
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-grow flex-col justify-center items-center space-y-8 p-4">
        <h1 className="text-2xl font-bold">My NFTs</h1>

        {/* List of NFT Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onClick={() => router.push(`/nft/${nft.id}`)} />
          ))}
        </div>

        {/* Back to Home Button */}
        <Button label="Back to Home" onClick={() => router.push("/")} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200 text-gray-600">
        © 2025 NFT Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default MyNFTs;
