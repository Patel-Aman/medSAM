"use client";
import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import styles from "./styles/FileUploader.module.css";

const FileUploader: React.FC<{ onFileChange: (file: File) => void }> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const resetFileInput = () => {
    setFileName(null);
  };

  return (
    <div className={styles.container}>
      {fileName ? (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{fileName}</span>
          <button className={styles.uploadButton} onClick={resetFileInput}>
            Upload File
          </button>
        </div>
      ) : (
        <label htmlFor="fileInput" className={styles.uploadBox}>
          <FaUpload className={styles.icon} />
          <span className={styles.text}>Click to upload an image</span>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default FileUploader;
