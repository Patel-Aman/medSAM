import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController';
import { validateFile } from '../middleware/fileValidation';
import { config } from '../config/config';
import { getMask } from '../controllers/boundingBoxController';

const upload = multer({ dest: config.uploadDir });

const router = Router();
router.post('/upload', upload.single('file'), validateFile, uploadFile);
router.post('/new-box', getMask) // to be implemented

export default router;
