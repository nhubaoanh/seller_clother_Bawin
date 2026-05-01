import { ProductRepository } from "../repositories/ProductRepository.js";
import { Product } from "../models/Product.js";
import { ImageUploadService } from "../utils/imageUpload.js";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts(pageIndex: number = 1, pageSize: number = 10) {
    try {
      const products = await this.productRepository.getAllProducts(pageIndex, pageSize);
      
      // Xử lý ảnh cho từng sản phẩm
      const processedProducts = products.map(product => this.processProductImages(product));
      
      const totalItems = products?.length > 0 ? products[0].RecordCount || products.length : 0;
      const pageCount = Math.ceil(totalItems / pageSize);

      return {
        success: true,
        data: processedProducts,
        totalItems,
        page: pageIndex,
        pageSize,
        pageCount,
        message: "Get products successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        totalItems: 0,
        page: pageIndex,
        pageSize,
        pageCount: 0,
        message: error.message || "Failed to get products"
      };
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.productRepository.getProductById(productId);
      
      if (!product) {
        return {
          success: false,
          data: null,
          message: "Product not found"
        };
      }

      // Xử lý ảnh cho sản phẩm
      const processedProduct = this.processProductImages(product);

      return {
        success: true,
        data: processedProduct,
        message: "Get product successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to get product"
      };
    }
  }

  async searchProducts(searchTerm: string, categoryId?: string, pageIndex: number = 1, pageSize: number = 10) {
    try {
      const products = await this.productRepository.searchProducts(searchTerm, categoryId, pageIndex, pageSize);
      
      // Xử lý ảnh cho từng sản phẩm
      const processedProducts = products.map(product => this.processProductImages(product));
      
      const totalItems = products?.length > 0 ? products[0].RecordCount || products.length : 0;
      const pageCount = Math.ceil(totalItems / pageSize);

      return {
        success: true,
        data: processedProducts,
        totalItems,
        page: pageIndex,
        pageSize,
        pageCount,
        message: "Search products successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        totalItems: 0,
        page: pageIndex,
        pageSize,
        pageCount: 0,
        message: error.message || "Failed to search products"
      };
    }
  }

  async getProductsByCategory(categoryId: string, pageIndex: number = 1, pageSize: number = 10) {
    try {
      const products = await this.productRepository.getProductsByCategory(categoryId, pageIndex, pageSize);
      
      // Xử lý ảnh cho từng sản phẩm
      const processedProducts = products.map(product => this.processProductImages(product));
      
      const totalItems = products?.length > 0 ? products[0].RecordCount || products.length : 0;
      const pageCount = Math.ceil(totalItems / pageSize);

      return {
        success: true,
        data: processedProducts,
        totalItems,
        page: pageIndex,
        pageSize,
        pageCount,
        message: "Get products by category successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        totalItems: 0,
        page: pageIndex,
        pageSize,
        pageCount: 0,
        message: error.message || "Failed to get products by category"
      };
    }
  }

  async getProductVariants(productId: string) {
    try {
      const variants = await this.productRepository.getProductVariants(productId);
      return {
        success: true,
        data: variants || [],
        message: "Get product variants successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || "Failed to get product variants"
      };
    }
  }

  // Admin methods
  async createProduct(productData: Product) {
    try {
      productData.productId = uuidv4();
      this.cleanProductUrls(productData);
      const result = await this.productRepository.createProduct(productData);
      
      return {
        success: true,
        data: result,
        message: "Create product successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to create product"
      };
    }
  }

  async updateProduct(productData: Product) {
    try {
      this.cleanProductUrls(productData);
      const result = await this.productRepository.updateProduct(productData);
      
      return {
        success: true,
        data: result,
        message: "Update product successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to update product"
      };
    }
  }

  async deleteProduct(productId: string, deletedBy: string) {
    try {
      const result = await this.productRepository.deleteProduct(productId, deletedBy);
      
      return {
        success: true,
        data: result,
        message: "Delete product successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to delete product"
      };
    }
  }

  /**
   * Xử lý ảnh sản phẩm - giữ nguyên đường dẫn relative, frontend sẽ tự thêm base URL
   */
  private processProductImages(product: any): any {
    // Xử lý thumbnail - giữ relative path
    if (product.thumbnail) {
      product.thumbnail = this.normalizeImagePath(product.thumbnail);
    } else {
      product.thumbnail = '';
    }
    
    // Xử lý danh sách ảnh
    if (product.images && typeof product.images === 'string') {
      product.images = product.images
        .split(',')
        .filter(Boolean)
        .map((img: string) => this.normalizeImagePath(img.trim()));
    } else {
      product.images = [];
    }
    
    // Đảm bảo có ít nhất thumbnail trong danh sách ảnh
    if (product.images.length === 0 && product.thumbnail) {
      product.images = [product.thumbnail];
    }
    
    return product;
  }

  /**
   * Chuẩn hóa đường dẫn ảnh - strip base URL nếu có, giữ relative path
   */
  private normalizeImagePath(imagePath: string): string {
    if (!imagePath) return '';
    
    // Nếu là full URL, strip base URL để chỉ giữ relative path
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    if (imagePath.startsWith(baseUrl)) {
      imagePath = imagePath.substring(baseUrl.length);
    }
    // Cũng xử lý cho trường hợp http://localhost:3000
    if (imagePath.startsWith('http://localhost:3000')) {
      imagePath = imagePath.substring('http://localhost:3000'.length);
    }
    
    // Chuẩn hóa backslash
    imagePath = imagePath.replace(/\\/g, '/');
    
    // Đảm bảo bắt đầu bằng /
    if (!imagePath.startsWith('/')) {
      imagePath = '/' + imagePath;
    }
    
    return imagePath;
  }

  /**
   * Làm sạch URL ảnh trước khi lưu vào DB - chỉ giữ relative path
   */
  private cleanProductUrls(productData: Product): void {
    // Clean thumbnail
    if (productData.thumbnail) {
      productData.thumbnail = this.normalizeImagePath(productData.thumbnail);
    }
    
    // Clean images array
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map(img => this.normalizeImagePath(img));
    }
  }
}