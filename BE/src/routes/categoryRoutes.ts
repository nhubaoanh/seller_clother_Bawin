import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { Database } from "../config/database.js";

const categoryRouter = Router();
const db = new Database();
const categoryController = new CategoryController(db);

// PUBLIC ROUTES
categoryRouter.get("/", categoryController.getAllCategories);

// ADMIN ROUTES
categoryRouter.post("/", categoryController.upsertCategory);
categoryRouter.put("/", categoryController.updateCategory);
categoryRouter.delete("/:categoryId", categoryController.deleteCategory);

export default categoryRouter;