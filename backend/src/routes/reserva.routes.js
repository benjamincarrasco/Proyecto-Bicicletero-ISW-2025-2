"use strict";
import { Router } from "express";
import * as reservaController from "../controllers/reserva.controller.js";

const router = Router();

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