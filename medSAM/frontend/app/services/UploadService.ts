import axiosInstance from "../utils/axios";

export const sendBoundingBox = async (filePath: string, boundingBox: string): Promise<string> => {
  const response = await axiosInstance.post(`new-box`, { filePath, boundingBox });
  return response.data.mask_image;
};
