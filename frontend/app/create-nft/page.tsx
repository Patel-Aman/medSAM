"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { useNFTContract } from "../../hooks/useNFTContract";

type FormData = {
  name: string;
  description: string;
  price: string;
  imageType: "upload" | "url";
  imageUrl: string;
  imageFile: File | null;
};

const CreateNFT: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    imageType: "upload",
    imageUrl: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mintNFT } = useNFTContract();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevState) => ({ ...prevState, imageFile: e.target.files[0] }));
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevState) => ({ ...prevState, imageType: value as "upload" | "url" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageType === "upload" && formData.imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadResponse.ok) throw new Error("Image upload failed");

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const tokenURI = JSON.stringify({
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        price: formData.price
      });

      // Send tokenURI to the smart contract
      const txHash = await mintNFT(tokenURI);
      console.log(`Transaction Hash: ${txHash}`);

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
                  checked={formData.imageType === "upload"}
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
                  checked={formData.imageType === "url"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Provide URL
              </label>
            </div>
          </div>

          {formData.imageType === "upload" ? (
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

          <Button label={loading ? "Creating..." : "Create NFT"} onClick={handleSubmit} />
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <Button label="Back to Home" onClick={() => router.push("/")} />
      </main>
    </div>
  );
};

export default CreateNFT;
