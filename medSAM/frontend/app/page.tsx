"use client"
import { useState } from "react";
import FileUploader from "./components/FileUploader";
import ImageEditor from "./components/ImageEditor";
import HomeStyles from "./styles/Home.module.css";
import styles from "./styles/global.module.css"
import useBoundingBoxes from "./hooks/useBoundingBoxes";

const Home = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [model, setModel] = useState<string>('MedSAM');
  const [modelSelected, setModelSelected] = useState<boolean>(false);
  const {clearBoundingBoxes} = useBoundingBoxes();
  const handleImageUpload = (uploadedSrc: string, uploadedPath: string) => {
    setImageSrc(uploadedSrc);
    setImagePath(uploadedPath);
    clearBoundingBoxes();
  };

  const handleModelSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModel(event.target.value);
    setModelSelected(true);
  }

  return (
    <div className={HomeStyles.container}>
      <h1 className={HomeStyles.title}>Medsam Demo</h1>
      <div style={{ position: "relative", textAlign: "center", marginBottom: "10px" }}>
        <h3>Select Model</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <label style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input 
              type="radio" 
              name="model" 
              value="SAM" 
              className={styles.radioStyle}
              onChange={handleModelSelection}
              style={{ width: "20px", height: "20px" }}
            />
            SAM
          </label>
          <label style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input 
              type="radio" 
              name="model" 
              value="MedSAM" 
              className={styles.radioStyle} 
              onChange={handleModelSelection}
              style={{ width: "20px", height: "20px" }}
            />
            MedSAM
          </label>
        </div>
      </div>

      <div className={HomeStyles.uploaderContainer}>
        <FileUploader onUpload={handleImageUpload} />
      </div>
      
      {imageSrc && imagePath && modelSelected && (
        <div className={HomeStyles.editorContainer}>
          <ImageEditor imageSrc={imageSrc} imagePath={imagePath} model={model}/>
        </div>
      )}
    </div>
  );
};

export default Home;
