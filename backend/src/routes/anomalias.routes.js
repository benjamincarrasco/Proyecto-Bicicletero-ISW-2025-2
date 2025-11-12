"use strict";
import { Router } from "express";
import { getAnomalias } from "../controllers/anomalias.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isGuardia } from "../middlewares/authorization.middleware.js";

const router = Router();

// Requiere autenticación
router.use(authenticateJwt);

// Ruta para obtener anomalías - accesible para Admin y Guardia
router.get("/", isGuardia, getAnomalias);

export default router;
