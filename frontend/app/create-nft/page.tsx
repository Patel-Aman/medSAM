"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/pinata";
import 'dotenv/config';
import nftContract from '../../../blockchain/artifacts/contracts/NFT.sol/NFT.json';
import { ethers } from "ethers";

type FormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

const CreateNFT: React.FC = () => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [imageType, setImageType] = useState('url');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
        //upload the file to IPFS
        if (!e.target.files || !e.target.files[0]) throw Error('please reupload the file');
        const response = await uploadFileToIPFS(e.target.files[0]);
        if(response.success === true) {
            console.log("Uploaded image to Pinata: ", response.pinataURL)
            await setFormData((prevState) => ({
              ...prevState,
              imageUrl: response.pinataURL ?? "",
            }));
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setImageType(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);   
    setError(null);

    try {
      let tokenUri;
      // Validate inputs
      if (!formData.name || !formData.description || !formData.price) {
        throw new Error("All fields are required.");
      }

      // upload metadata to pinata and send transaction to smart contract
      try {
        const nftJSON = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl: formData.imageUrl,
        };
        console.log(nftJSON);
        const response = await uploadJSONToIPFS(nftJSON);

        if(response.success === true){
          console.log("Uploaded JSON to Pinata: ", response)
          tokenUri =  response.pinataURL;
        }
        if(typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // Create a contract instance
          const contract = new ethers.Contract(contractAddress, nftContract.abi, signer);

          const txHash = await contract.mintNFT(tokenUri);
          console.log(txHash);
        }
      } catch(e) {
        console.log(`following error occured: ${e}`);
      }
     
      // Navigate back to the NFTs listing
      router.push("/my-nfts");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <Navbar />

      <main className="flex flex-grow flex-col justify-center items-center space-y-8 p-4">
        <h1 className="text-2xl font-bold">Create New NFT</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-lg"
        >
          <div>
            <label htmlFor="name" className="block text-gray-700">
              NFT Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Choose Image Upload Method</label>
            <div className="flex items-center space-x-4 mt-2">
              <label>
                <input
                  type="radio"
                  name="imageType"
                  value="upload"
                  checked={imageType === "upload"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Upload Image
              </label>
              <label>
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={imageType === "url"}

                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Provide URL
              </label>
            </div>
          </div>

          {imageType === "upload" ? (
            <div>
              <label htmlFor="imageFile" className="block text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleFileChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="imageUrl" className="block text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="price" className="block text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <Button
            disabled={!formData.name || !formData.description || !formData.imageUrl || loading}
            label={
              !formData.name || !formData.description || !formData.imageUrl
                ? "Provide Inputs and wait for file to upload"
                : loading
                ? "Creating..."
                : "Create NFT"
            }
            onClick={handleSubmit}
          />
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <Button label="Back to Home" onClick={() => router.push("/")} />
      </main>

      <footer className="py-4 text-center bg-gray-200 text-gray-600">
        © 2025 NFT Marketplace. All rights reserved.
      </footer>
    </div>
  );
};

export default CreateNFT;
