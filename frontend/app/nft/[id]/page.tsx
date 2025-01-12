"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Button from "../../../components/Button";
import Image from "next/image";
import { useNFTContract } from "@/hooks/useNFTContract";

type NFT = {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price?: string; // Optional if price isn't always present
};

const NFTDetail: React.FC = () => {
  const [nft, setNft] = useState<NFT | null>(null); // State to store selected NFT data
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { fetchNFT } = useNFTContract();
  const { id } = useParams(); // Get NFT ID from the URL query

  const fetchNFTDetails = async (tokenId: string) => {
    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    try {
      setLoading(true);

      // Fetch NFT URI and metadata
      const tokenURI = await fetchNFT(tokenId)
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      setNft({
        tokenId: Number(tokenId),
        name: metadata.name,
        description: metadata.description,
        image: metadata.imageUrl,
        price: metadata.price ? `${metadata.price} ETH` : undefined,
      });
    } catch (error) {
      console.error("Error fetching NFT details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNFTDetails(id as string);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
        <p>Loading NFT...</p>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
        <p>NFT not found.</p>
        <Button label="Back to My NFTs" onClick={() => router.push("/my-nfts")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-grow flex-col justify-center items-center space-y-8 p-4">
        <h1 className="text-2xl font-bold">{nft.name}</h1>
        <Image
          src={nft.image}
          alt={nft.name}
          width={400}
          height={400}
          className="w-96 h-96 object-cover rounded-md"
        />
        <p className="text-lg text-gray-600 mt-4">{nft.description}</p>
        {nft.price && <p className="text-xl font-bold text-gray-800 mt-2">{nft.price}</p>}

        {/* Back Button */}
        <Button label="Back to My NFTs" onClick={() => router.push("/my-nfts")} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center bg-gray-200 text-gray-600">
        © 2025 NFT Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default NFTDetail;
