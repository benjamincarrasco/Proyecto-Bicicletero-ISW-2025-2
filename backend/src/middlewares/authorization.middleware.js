"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });
    
    if (!userFound) return handleErrorClient(res, 404, "Usuario no encontrado");
    if (userFound.rol !== "administrador") return handleErrorClient(res, 403, "Se requiere rol de administrador");
    
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isGuardia(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ email: req.user.email });
    
    if (!userFound) return handleErrorClient(res, 404, "Usuario no encontrado");
    if (userFound.rol !== "guardia" && userFound.rol !== "administrador") {
      return handleErrorClient(res, 403, "Se requiere rol de guardia o administrador");
    }
    
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}