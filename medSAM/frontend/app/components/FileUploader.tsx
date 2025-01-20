import React, { ChangeEvent, useState } from "react";
import axiosInstance from "../utils/axios";
import { FaUpload } from "react-icons/fa";
import styles from "../styles/FileUploader.module.css";

interface FileUploaderProps {
  onUpload: (imageSrc: string, imagePath: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
    const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;

        // Upload file to the backend
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axiosInstance.post("upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const imagePath = response.data.path; // Backend path for the image
          onUpload(imageSrc, imagePath); // Pass data to parent component
        } catch (error) {
          console.error("File upload failed:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {fileName ? (
          <input type="file" accept="image/*" onChange={handleFileChange} />
      ): (
        <div className={styles.container}>
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
        </div>
      )}
      </div>
  );
  return
};

export default FileUploader;
