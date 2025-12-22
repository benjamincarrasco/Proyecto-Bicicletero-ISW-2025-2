"use strict";
import { Router } from "express";
import { buscarBicicleta,
    getAllBicicletas,
    registerBicycle,
    registrarSalidaBicicleta, 
    removeBicycle,
} from "../controllers/bicicleta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, isGuardia } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/buscar", buscarBicicleta)
  .get("/datos", isGuardia, getAllBicicletas)
  .post("/register", registerBicycle)
  .patch("/remove/:id", isAdmin, removeBicycle)
  .post("/salida", registrarSalidaBicicleta);

export default router;











