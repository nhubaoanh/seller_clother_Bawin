import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { Database } from "../config/database.js";

const productRouter = Router();
const db = new Database();
const productController = new ProductController(db);

// PUBLIC ROUTES
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:productId", productController.getProductById);
productRouter.get("/:productId/variants", productController.getProductVariants);

// ADMIN ROUTES
productRouter.post("/", productController.createProduct);
productRouter.put("/:productId", productController.updateProduct);
productRouter.delete("/:productId", productController.deleteProduct);

export default productRouter;