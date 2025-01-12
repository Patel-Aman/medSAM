"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import 'dotenv/config'
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import NFTCard from "@/components/NFTCard";
import nftContract from "../../../blockchain/artifacts/contracts/NFT.sol/NFT.json"; // Import the ABI of the contract

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

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  const fetchNFTs = useCallback(async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        // Connect to MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, nftContract.abi, signer);

        const [tokenIds, tokenURIs] = await contract.getMyNFTs();

        const ownedNFTs = await Promise.all(
          tokenIds.map(async (tokenId, index) => {
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

        console.log(ownedNFTs);

        await setNfts(ownedNFTs);
        console.log("nfts");
        console.log(nfts);
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, nfts]);

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
