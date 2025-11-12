"use strict";
import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// El dashboard es accesible para usuarios autenticados (Guardia y Admin)
router.use(authenticateJwt);

// GET /api/dashboard
router.get("/", getDashboard);

export default router;
