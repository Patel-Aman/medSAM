import React, { ChangeEvent } from "react";
import axiosInstance from "../utils/axios";

interface FileUploaderProps {
  onUpload: (imageSrc: string, imagePath: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
};

export default FileUploader;
