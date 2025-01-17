import { Request, Response, NextFunction } from 'express';

export const validateFile = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    res.status(400).json({ error: 'Invalid file type.' });
    return;
  }

  next();
};
