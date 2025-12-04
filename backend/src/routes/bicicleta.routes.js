"use strict";
import { Router } from "express";
import { buscarBicicleta,
    getDatosBicicletas, 
    registerBicycle,
    registrarSalidaBicicleta, 
    removeBicycle,
    getAllBicicletas,
} from "../controllers/bicicleta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/buscar", buscarBicicleta)
  .get("/datos", getDatosBicicletas)
  .get("/", getAllBicicletas)  // Obtener todas las bicicletas
  .post("/register", registerBicycle)
  .patch("/remove/:id", removeBicycle)
  .post("/salida", registrarSalidaBicicleta);

export default router;











