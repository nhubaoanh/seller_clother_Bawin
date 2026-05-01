import fs from 'fs';
import path from 'path';

export class ImageUploadService {
  private static uploadDir = 'uploads';
  
  /**
   * Tạo đường dẫn lưu ảnh theo cấu trúc: uploads/YYYY/MM/DD/
   */
  static generateImagePath(type: 'products' | 'users' | 'categories' = 'products'): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${this.uploadDir}/${type}/${year}/${month}/${day}`;
  }
  
  /**
   * Tạo thư mục nếu chưa tồn tại
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  
  /**
   * Tạo tên file unique
   */
  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    return `${timestamp}_${random}${ext}`;
  }
  
  /**
   * Lưu ảnh và trả về đường dẫn
   */
  static async saveImage(
    fileBuffer: Buffer, 
    originalName: string, 
    type: 'products' | 'users' | 'categories' = 'products'
  ): Promise<string> {
    try {
      // Tạo đường dẫn thư mục
      const dirPath = this.generateImagePath(type);
      this.ensureDirectoryExists(dirPath);
      
      // Tạo tên file unique
      const fileName = this.generateFileName(originalName);
      const fullPath = path.join(dirPath, fileName);
      
      // Lưu file
      fs.writeFileSync(fullPath, fileBuffer);
      
      // Trả về đường dẫn relative để lưu vào DB
      return `/${dirPath}/${fileName}`.replace(/\\/g, '/');
      
    } catch (error) {
      throw new Error(`Failed to save image: ${error}`);
    }
  }
  
  /**
   * Xóa ảnh
   */
  static deleteImage(imagePath: string): boolean {
    try {
      const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }
  
  /**
   * Tạo URL đầy đủ cho frontend
   */
  static getImageUrl(imagePath: string, baseUrl: string = 'http://localhost:3000'): string {
    if (!imagePath) return `${baseUrl}/placeholder.svg`;
    if (imagePath.startsWith('http')) return imagePath;

    // Đảm bảo không bị thiếu dấu / giữa baseUrl và imagePath
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Chuẩn hóa dấu gạch chéo cho Windows
    const normalizedPath = cleanImagePath.replace(/\\/g, '/');
    
    return `${cleanBaseUrl}${normalizedPath}`;
  }
}