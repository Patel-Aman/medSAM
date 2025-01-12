"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import NFTCard from "@/components/NFTCard";
import { useNFTContract } from "@/hooks/useNFTContract";

type NFT = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

const MyNFTs: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]); // State to store NFTs
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();
  const { fetchMyNFTs } = useNFTContract();

  const fetchNFTs = useCallback(async () => {
    try {
        const ownedNFTs = await fetchMyNFTs();
        setNfts(ownedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNFTs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p>Loading your NFTs...</p>
      </div>
    );
  }

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
