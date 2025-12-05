"use strict";
import { Router } from "express";
import { buscarBicicleta,
    getAllBicicletas,
    registerBicycle,
    registrarSalidaBicicleta, 
    removeBicycle,
} from "../controllers/bicicleta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/buscar", buscarBicicleta)
  .get("/datos", getAllBicicletas)
  .post("/register", registerBicycle)
  .patch("/remove/:id", removeBicycle)
  .post("/salida", registrarSalidaBicicleta);

export default router;











