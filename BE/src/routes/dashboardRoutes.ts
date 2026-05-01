import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import { Database } from "../config/database.js";

const dashboardRouter = Router();
const db = new Database();
const dashboardController = new DashboardController(db);

dashboardRouter.post("/statistics", dashboardController.getStatistics);

export default dashboardRouter;
