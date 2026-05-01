import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ImageUploadService } from '../utils/imageUpload.js';

// Cấu hình storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = ImageUploadService.generateImagePath('products');
    ImageUploadService.ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = ImageUploadService.generateFileName(file.originalname);
    cb(null, fileName);
  }
});

// File filter - chỉ cho phép ảnh
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif, webp)'));
  }
};

// Cấu hình multer
export const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter
}).single('image');

export const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
}).array('images', 10);

// Middleware xử lý lỗi upload
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa là 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file. Tối đa 10 file'
      });
    }
  }
  
  if (error.message.includes('Chỉ cho phép upload file ảnh')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};