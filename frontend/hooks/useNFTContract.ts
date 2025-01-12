import { ethers } from "ethers";
import { useCallback } from "react";
import NFTAbi from "../../blockchain/artifacts/contracts/NFT.sol/NFT.json"; // Add ABI for the NFT contract

const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replace with deployed contract address

export const useNFTContract = () => {
  const mintNFT = useCallback(async (tokenURI: string) => {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTAbi, signer);

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
