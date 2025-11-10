"use strict";
import { getParkingConfigService, updateParkingConfigService } from "../services/parking.service.js";
import { parkingConfigValidation } from "../validations/parking.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function updateParkingConfig(req, res) {
  try {
    const { error } = parkingConfigValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, "Datos inválidos", error.message);

    const [config, errorUpdate] = await updateParkingConfigService(req.body);
    if (errorUpdate) return handleErrorClient(res, 400, errorUpdate);

    handleSuccess(res, 200, "Configuración actualizada correctamente", config);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getParkingConfig(req, res) {
  try {
    const [config, error] = await getParkingConfigService();
    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Configuración del bicicletero", config);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}