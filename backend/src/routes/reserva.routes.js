"use strict";
import { Router } from "express";
import * as reservaController from "../controllers/reserva.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

//ruta para crear una reserva
router.post(
  "/",
  reservaController.createReserva
);

//(debería ser solo para admins)
router.get(
  "/",
  reservaController.getReservas
);

//ruta para obtener una reserva específica
router.get(
  "/:id",
  reservaController.getReservaById
);

export default router;