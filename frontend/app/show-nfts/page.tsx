"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import NFTCard from "@/components/NFTCard";
import { useRouter } from "next/navigation";
import { useNFTContract } from "@/hooks/useNFTContract";

type NFT = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

const AllNFTs: React.FC = () => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { fetchAllNFTs } = useNFTContract();

  const fetchNFTs = async () => {
        try {
      setLoading(true);
      
      // Fetch metadata for each NFT
      const nftsData: NFT[] = await fetchAllNFTs();
      setNFTs(nftsData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <Navbar />
      <main className="flex flex-grow flex-col justify-center items-center space-y-8 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">All NFTs</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading NFTs...</p>
        ) : nfts.length === 0 ? (
          <p className="text-center text-gray-600">No NFTs found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* List of NFT Cards */}
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onClick={() => router.push(`/nft/${nft.id}`)} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200 text-gray-600">
        © 2025 NFT Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default AllNFTs;
