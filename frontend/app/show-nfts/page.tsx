"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { ethers } from "ethers";
import NFTContract from "../../../blockchain/artifacts/contracts/NFT.sol/NFT.json";
import Image from "next/image";
import 'dotenv/config'


const contract_address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

type NFT = {
  tokenId: string;
  tokenURI: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
};

const AllNFTs: React.FC = () => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not detected");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contract_address, NFTContract.abi, provider);

      // Call the smart contract to fetch all NFTs
      const [tokenIds, tokenURIs]: [string[], string[]] = await contract.getAllNFTs();

      // Fetch metadata for each NFT
      const nftsData: NFT[] = await Promise.all(
        tokenIds.map(async (tokenId: string, index: number) => {
          const tokenURI = tokenURIs[index];
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          return { tokenId, tokenURI, metadata };
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">All NFTs</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading NFTs...</p>
        ) : nfts.length === 0 ? (
          <p className="text-center text-gray-600">No NFTs found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="bg-white p-4 shadow rounded-lg flex flex-col items-center"
              >
                <Image
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  height={500}
                  width={500}
                  className="h-48 w-full object-cover rounded"
                />
                <h2 className="mt-4 font-bold">{nft.metadata.name}</h2>
                <p className="text-gray-600 text-sm mt-2">{nft.metadata.description}</p>
                <p className="text-gray-500 text-xs mt-2">Token ID: {nft.tokenId}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllNFTs;
