"use strict";
import { buscarBicicletaService,
        getBicicletaseDatosService, 
        registerBicycleService, 
        removeBicycleService
    } from "../services/bicicleta.service.js";
import { bicycleRegisterValidation, buscarBicicletaValidation } from "../validations/bicicleta.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function buscarBicicleta(req, res) {
  try {
    const { error } = buscarBicicletaValidation.validate(req.query);
    if (error) return handleErrorClient(res, 400, error.message);

    const [bicicleta, errorBicicleta] = await buscarBicicletaService(req.query);
    if (errorBicicleta) 
        return handleErrorClient(res, 404, errorBicicleta);

    handleSuccess(res, 200, "Bicicletas encontradas", bicicleta);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function registerBicycle(req, res) {
  try {
    const { error } = bicycleRegisterValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [bicycle, errorBicycle] = await registerBicycleService(req.body);
    if (errorBicycle) return handleErrorClient(res, 400, errorBicycle);

    handleSuccess(res, 201, "Bicicleta registrada exitosamente", bicycle);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function removeBicycle(req, res) {
  try {
    const { id } = req.params;
    const [bicycle, error] = await removeBicycleService(id);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Bicicleta retirada exitosamente", bicycle);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getDatosBicicletas(req, res) {
  try {
    const [stats, error] = await getBicicletaseDatosService();
    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Estadísticas del bicicletero", stats);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}