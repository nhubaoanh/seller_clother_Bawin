import { Request, Response } from 'express';
import { ImageUploadService } from '../utils/imageUpload.js';
import path from 'path';

export class UploadController {
  
  /**
   * Upload single image
   */
  async uploadSingle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Không có file được upload'
        });
        return;
      }

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const relativePath = `/${req.file.path.replace(/\\/g, '/')}`;
      const fullUrl = ImageUploadService.getImageUrl(relativePath, baseUrl);

      res.json({
        success: true,
        message: 'Upload ảnh thành công',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: relativePath,
          url: fullUrl,
          size: req.file.size
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi upload ảnh'
      });
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultiple(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Không có file được upload'
        });
        return;
      }

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const uploadedFiles = files.map(file => {
        const relativePath = `/${file.path.replace(/\\/g, '/')}`;
        return {
          filename: file.filename,
          originalName: file.originalname,
          path: relativePath,
          url: ImageUploadService.getImageUrl(relativePath, baseUrl),
          size: file.size
        };
      });

      res.json({
        success: true,
        message: `Upload ${files.length} ảnh thành công`,
        data: uploadedFiles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi upload ảnh'
      });
    }
  }

  /**
   * Delete image
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { imagePath } = req.body;
      
      if (!imagePath) {
        res.status(400).json({
          success: false,
          message: 'Thiếu đường dẫn ảnh'
        });
        return;
      }

      const deleted = ImageUploadService.deleteImage(imagePath);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Xóa ảnh thành công'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy ảnh hoặc ảnh đã bị xóa'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xóa ảnh'
      });
    }
  }
}