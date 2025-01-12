import { ethers } from "ethers";
import NFTContract from "../../blockchain/artifacts/contracts/NFT.sol/NFT.json";
import 'dotenv/config'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

const getContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask not detected");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, NFTContract.abi, signer);
};

export const useNFTContract = () => {
  // Mint new NFT
  const mintNFT = async (tokenURI: string) => {
    try {
      const contract = await getContract();
      const tx = await contract.mintNFT(tokenURI);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("NFT Minted Successfully!");
      return tx.hash;
    } catch (err) {
      console.error("Failed to mint NFT:", err);
      throw err;
    }
  };

  // Fetch My NFTs
  const fetchMyNFTs = async () => {
    try {
      const contract = await getContract();
      const [tokenIds, tokenURIs] = await contract.getMyNFTs();

      const ownedNFTs = await Promise.all(
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

      return ownedNFTs;
    } catch (error) {
      console.error("Error fetching My NFTs:", error);
      throw error;
    }
  };

  // Fetch All NFTs
  const fetchAllNFTs = async () => {
    try {
      const contract = await getContract();
      const [tokenIds, tokenURIs] = await contract.getAllNFTs();

      const NFTs = await Promise.all(
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

      return NFTs;  
    } catch (error) {
      console.error("Error fetching My NFTs:", error);
      throw error;
    }
    
  }

  // Fetch a NFT
  const fetchNFT = async (tokenId: string) => {
    try {
      const contract = await getContract();
      const tokenURI = await contract.tokenURI(tokenId);
      return tokenURI;
    } catch (error) {
      console.error("Error fetching My NFTs:", error);
      throw error;
    }
  }

  return { mintNFT, fetchMyNFTs, fetchAllNFTs, fetchNFT };
};
