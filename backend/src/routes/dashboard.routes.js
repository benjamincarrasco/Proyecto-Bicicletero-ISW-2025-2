"use strict";
import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getDashboard);

export default router;
