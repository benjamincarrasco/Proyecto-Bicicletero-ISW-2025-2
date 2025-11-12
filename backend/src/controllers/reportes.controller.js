"use strict";
import { getReporteTendenciasService, generarCSV } from "../services/reportes.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Controlador para obtener reporte de tendencias de uso
 * GET /api/reportes/tendencias?fechaInicio=2024-10-01&fechaFin=2024-10-31
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export async function getReporteTendencias(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionaron las fechas
    if (!fechaInicio || !fechaFin) {
      return handleErrorClient(
        res,
        400,
        "Debe proporcionar los parámetros: fechaInicio y fechaFin (formato YYYY-MM-DD)"
      );
    }

    // Llamar al servicio
    const [reporteData, error] = await getReporteTendenciasService(fechaInicio, fechaFin);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    handleSuccess(res, 200, "Reporte de tendencias generado correctamente", reporteData);
  } catch (error) {
    console.error("Error en getReporteTendencias:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Controlador para exportar reporte de tendencias en CSV
 * GET /api/reportes/tendencias/csv?fechaInicio=2024-10-01&fechaFin=2024-10-31
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export async function exportarReporteTendenciasCSV(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionaron las fechas
    if (!fechaInicio || !fechaFin) {
      return handleErrorClient(
        res,
        400,
        "Debe proporcionar los parámetros: fechaInicio y fechaFin (formato YYYY-MM-DD)"
      );
    }

    // Llamar al servicio
    const [reporteData, error] = await getReporteTendenciasService(fechaInicio, fechaFin);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    // Generar CSV
    const csv = generarCSV(reporteData.datosParaCSV);

    // Configurar headers para descargar archivo
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reporte_tendencias_${fechaInicio}_${fechaFin}.csv"`
    );

    // Enviar CSV
    res.send(csv);
  } catch (error) {
    console.error("Error en exportarReporteTendenciasCSV:", error);
    handleErrorServer(res, 500, error.message);
  }
}
