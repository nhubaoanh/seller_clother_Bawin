import { Router } from "express";
import productRoutes from "./productRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

// Mount routes
router.use("/products", productRoutes);
router.use("/upload", uploadRoutes);
router.use("/categories", categoryRoutes);
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/user", userRoutes);
router.use("/role", roleRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;