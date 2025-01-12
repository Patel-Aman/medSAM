import { ethers } from "ethers";
import { useCallback } from "react";
import NFTContract from "../../blockchain/artifacts/contracts/NFT.sol/NFT.json";
import 'dotenv/config'

const contract_address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

export const useNFTContract = () => {
  const mintNFT = useCallback(async (tokenURI: string) => {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contract_address, NFTContract.abi, signer);

    try {
      const tx = await contract.mintNFT(tokenURI);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("NFT Minted Successfully!");
      return tx.hash;
    } catch (err) {
      console.error("Failed to mint NFT:", err);
      throw err;
    }
  }, []);

  return { mintNFT };
};
