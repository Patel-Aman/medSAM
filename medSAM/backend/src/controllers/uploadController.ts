import { Request, Response } from 'express';
import { saveFile } from '../services/fileService';

export const uploadFile = (req: Request, res: Response) => {
  try {
    console.log('file triggered');
    const filePath = saveFile(req.file!);
    res.status(200).json({ message: 'File uploaded successfully.', path: filePath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file.' });
  }
};