"use client"
import { useState } from "react";
import FileUploader from "./components/FileUploader";
import ImageEditor from "./components/ImageEditor";

const Home = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleImageUpload = (uploadedSrc: string, uploadedPath: string) => {
    setImageSrc(uploadedSrc);
    setImagePath(uploadedPath);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>Medsam Demo</h1>
      <div style={{ marginBottom: "20px" }}>
      <FileUploader onUpload={handleImageUpload} />
      </div>
      {imageSrc && imagePath && <ImageEditor imageSrc={imageSrc} imagePath={imagePath} />}
    </div>
  );
};

export default Home;
