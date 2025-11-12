"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import parkingRoutes from "./parking.routes.js";
import bicletaRoutes from "./bicicleta.routes.js";
import reservaRoutes from "./reserva.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "API Bicicletero funcionando correctamente" });
});

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/parking", parkingRoutes)
    .use("/bicis", bicletaRoutes)
    .use("/reservas", reservaRoutes)
    .use("/dashboard", dashboardRoutes);


export default router;