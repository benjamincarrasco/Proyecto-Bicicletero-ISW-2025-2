"use strict";
import { getAnomaliasBicicletasService } from "../services/anomalias.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Controlador para obtener bicicletas con estadías prolongadas (anomalías)
 * GET /api/anomalias?horasMaximas=24
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export async function getAnomalias(req, res) {
  try {
    const { horasMaximas } = req.query;

    // Validar que se proporcionó el parámetro
    if (!horasMaximas) {
      return handleErrorClient(
        res,
        400,
        "Debe proporcionar el parámetro: horasMaximas (número)"
      );
    }

    // Convertir a número y validar
    const horas = parseFloat(horasMaximas);
    if (isNaN(horas) || horas <= 0) {
      return handleErrorClient(
        res,
        400,
        "horasMaximas debe ser un número positivo"
      );
    }

    // Llamar al servicio
    const [resultado, error] = await getAnomaliasBicicletasService(horas);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    handleSuccess(res, 200, "Anomalías obtenidas correctamente", resultado);
  } catch (error) {
    console.error("Error en getAnomalias:", error);
    handleErrorServer(res, 500, error.message);
  }
}
