import { Router } from "express";
import { InventoryController } from "../controllers/InventoryController.js";
import { Database } from "../config/database.js";

const inventoryRouter = Router();
const db = new Database();
const inventoryController = new InventoryController(db);

// ADMIN ROUTES
inventoryRouter.post("/import", inventoryController.addImport);
inventoryRouter.get("/history", inventoryController.getImportHistory);
inventoryRouter.get("/report", inventoryController.getStockReport);

export default inventoryRouter;
