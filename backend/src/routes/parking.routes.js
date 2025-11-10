"use strict";
import { Router } from "express";
import { getParkingConfig, updateParkingConfig } from "../controllers/parking.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .patch("/config", updateParkingConfig)
  .get("/config", getParkingConfig);

export default router;