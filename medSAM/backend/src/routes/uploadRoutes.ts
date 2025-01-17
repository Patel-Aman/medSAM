import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController';
import { validateFile } from '../middleware/fileValidation';
import { config } from '../config/config';

const upload = multer({ dest: config.uploadDir });

const router = Router();
router.post('/upload', upload.single('file'), validateFile, uploadFile);
router.get('/info', (req, res) => {
    res.send("you've reached uploads");
})


export default router;
