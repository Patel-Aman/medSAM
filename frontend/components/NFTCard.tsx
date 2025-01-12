import React from "react";
import Image from "next/image";

type NFT = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

interface NFTCardProps {
  nft: NFT;
  onClick: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  return (
    <div
      className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={nft.imageUrl}
        alt={nft.name}
        className="w-full h-48 object-cover rounded-t-md"
        height="500"
        width="500"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{nft.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{nft.description}</p>
        <p className="text-md font-bold text-gray-800 mt-2">{nft.price}</p>
      </div>
    </div>
  );
};

export default NFTCard;
