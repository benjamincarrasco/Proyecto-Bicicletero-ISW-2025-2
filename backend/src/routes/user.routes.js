"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// Endpoint de perfil (para cualquier usuario autenticado)
router.get("/profile", authenticateJwt, (req, res) => {
  try {
    // El usuario está en req.user (del JWT decodificado)
    res.json({
      status: "Success",
      message: "Perfil del usuario",
      data: {
        id: req.user.id,
        nombreCompleto: req.user.nombreCompleto,
        email: req.user.email,
        rut: req.user.rut,
        rol: req.user.rol,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// Rutas protegidas solo para admin
router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser);

export default router;