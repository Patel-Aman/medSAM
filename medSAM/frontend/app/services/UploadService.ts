import axiosInstance from "../utils/axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.filePath; // Expecting the backend to return a file path
};

export const sendBoundingBox = async (filePath: string, boundingBox: string): Promise<string> => {
  const response = await axiosInstance.post(`new-box`, { filePath, boundingBox });
  return response.data.mask_image; // Expecting base64 image data
};
