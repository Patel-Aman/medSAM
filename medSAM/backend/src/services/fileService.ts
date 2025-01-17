import path from 'path';
import fs from 'fs';
import { config } from '../config/config';

export const saveFile = (file: Express.Multer.File): string => {
  const uploadPath = path.resolve(config.uploadDir, file.filename);
  fs.mkdirSync(config.uploadDir, { recursive: true });
  fs.renameSync(file.path, uploadPath);
  return uploadPath;
};
