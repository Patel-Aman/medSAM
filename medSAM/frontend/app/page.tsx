"use client"
import { useState } from "react";
import ImageEditor from "../components/ImageEditor";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>Medsam Demo</h1>
      <div style={{ marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {image && <ImageEditor imageSrc={image} />}
    </div>
  );
};

export default Home;
