"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import parkingRoutes from "./parking.routes.js";
import bicicletaRoutes from "./bicicleta.routes.js";
const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/parking", parkingRoutes)
    .use("/bicicleta", bicicletaRoutes);


export default router;