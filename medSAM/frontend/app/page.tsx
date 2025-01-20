"use client"
import { useState } from "react";
import FileUploader from "./components/FileUploader";
import ImageEditor from "./components/ImageEditor";
import styles from "./styles/Home.module.css";

const Home = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleImageUpload = (uploadedSrc: string, uploadedPath: string) => {
    setImageSrc(uploadedSrc);
    setImagePath(uploadedPath);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Medsam Demo</h1>
      <div className={styles.uploaderContainer}>
        <FileUploader onUpload={handleImageUpload} />
      </div>
      {imageSrc && imagePath && (
        <div className={styles.editorContainer}>
          <ImageEditor imageSrc={imageSrc} imagePath={imagePath} />
        </div>
      )}
    </div>
  );
};

export default Home;
