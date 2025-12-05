"use strict";
import { buscarBicicletaService,
        getAllBicicletasService,
        registerBicycleExitService,
        registerBicycleService, 
        removeBicycleService,
    } from "../services/bicicleta.service.js";
import { bicycleExitValidation,bicycleRegisterValidation, 
  buscarBicicletaValidation  } from "../validations/bicicleta.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function buscarBicicleta(req, res) {
  try {
    const { rut, cupoId } = req.query;

    const { error } = buscarBicicletaValidation.validate({ rut, cupoId });
    if (error) {
      return handleErrorClient(res, 400, error.message);
    }

    const [bicicleta, errorBicicleta] = await buscarBicicletaService({ rut, cupoId });
    if (errorBicicleta) 
        return handleErrorClient(res, 404, errorBicicleta);

    handleSuccess(res, 200, "Bicicleta encontrada", bicicleta);
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

export async function registrarSalidaBicicleta(req, res) {
  try {
    const { error } = bicycleExitValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [result, errorExit] = await registerBicycleExitService(req.body);
    if (errorExit) return handleErrorClient(res, 400, errorExit);

    handleSuccess(res, 200, "Salida registrada exitosamente. Jornada completada.", result);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllBicicletas(req, res) {
  try {
    const [bicycles, error] = await getAllBicicletasService();
    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Bicicletas obtenidas exitosamente", bicycles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}