import { Router } from 'express';
import { UploadController } from '../controllers/UploadController.js';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = Router();
const uploadController = new UploadController();

// Upload single image
router.post('/single', uploadSingle, handleUploadError, (req, res) => 
  uploadController.uploadSingle(req, res)
);

// Upload multiple images
router.post('/multiple', uploadMultiple, handleUploadError, (req, res) => 
  uploadController.uploadMultiple(req, res)
);

// Delete image
router.delete('/delete', (req, res) => 
  uploadController.deleteImage(req, res)
);

export default router;