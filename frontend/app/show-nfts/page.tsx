"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { ethers } from "ethers";
import NFTContract from "../../../blockchain/artifacts/contracts/NFT.sol/NFT.json";
import NFTCard from "@/components/NFTCard";
import 'dotenv/config'
import { useRouter } from "next/navigation";

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

  const contract_address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

  const fetchNFTs = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, NFTContract.abi, signer);

      // Call the smart contract to fetch all NFTs
      const [tokenIds, tokenURIs]: [string[], string[]] = await contract.getAllNFTs();

      // Fetch metadata for each NFT
      const nftsData: NFT[] = await Promise.all(
        tokenIds.map(async (tokenId: string, index: number) => {
          const tokenURI = tokenURIs[index];
          const response = await fetch(tokenURI);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for token ${tokenId}: ${response.statusText}`);
          }
    
          const metadata = await response.json();
          return {
            id: Number(tokenId.toString()),
            name: metadata.name,
            description: metadata.description,
            imageUrl: metadata.imageUrl,
            price: metadata.price,
          };
        })
      );

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
