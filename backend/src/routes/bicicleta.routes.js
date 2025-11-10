"use strict";
import { Router } from "express";
import { buscarBicicleta,
    getDatosBicicletas,   
} from "../controllers/bicicleta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isGuardia } from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isGuardia);

router
  .get("/buscar", buscarBicicleta)
  .get("/datos", getDatosBicicletas);

export default router;