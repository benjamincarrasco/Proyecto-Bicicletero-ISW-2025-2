"use strict";
import { Router } from "express";
import { getReporteTendencias, exportarReporteTendenciasCSV } from "../controllers/reportes.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isGuardia } from "../middlewares/authorization.middleware.js";

const router = Router();

// Ambas rutas requieren autenticación
router.use(authenticateJwt);

// Rutas de tendencias de uso - accesibles para Admin y Guardia
router.get("/tendencias", isGuardia, getReporteTendencias);
router.get("/tendencias/csv", isGuardia, exportarReporteTendenciasCSV);

export default router;
