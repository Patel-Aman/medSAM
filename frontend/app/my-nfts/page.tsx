"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);

        if (typeof window.ethereum !== "undefined") {
          // Connect to MetaMask
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // Get the connected wallet address
          const walletAddress = await signer.getAddress();

          // Create a contract instance
          const contract = new ethers.Contract(contractAddress, nftContract.abi, provider);

          // Fetch the total number of NFTs
          const totalSupply = await contract.nextTokenId();

          // Iterate through NFTs and fetch metadata for NFTs owned by the connected wallet
          const ownedNFTs: NFT[] = [];
          for (let tokenId = 0; tokenId < Number(totalSupply.toString()); tokenId++) {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === walletAddress.toLowerCase()) {
              const tokenURI = await contract.tokenURI(tokenId);
              const response = await fetch(tokenURI);

              console.log(response)

              // ownedNFTs.push({
              //   id: tokenId,
              //   name: metadata.name,
              //   description: metadata.description,
              //   imageUrl: metadata.image,
              //   price: "N/A", // Placeholder, add price logic if needed
              // });
            }
          }

          setNfts(ownedNFTs);
        } else {
          alert("Please install MetaMask to use this feature.");
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  });

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
