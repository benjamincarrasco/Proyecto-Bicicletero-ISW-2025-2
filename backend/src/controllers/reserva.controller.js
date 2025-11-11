"use strict";
import * as reservaService from "../services/reserva.service.js";
import { reservaSchema } from "../validations/reserva.validation.js";
import { 
    handleErrorClient, 
    handleErrorServer, 
    handleSuccess
} from "../handlers/responseHandlers.js";

export const createReserva = async (req, res) => {
  try {
    const { error, value } = reservaSchema.validate(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400, 
        "Error de validación en los datos",
        error.details[0].message
      );
    }

    const [reserva, errorService] = await reservaService.createReservaService(value);

    if (errorService) {
      if (errorService.includes("reservado")) {
        return handleErrorClient(res, 400, "Error al crear la reserva", errorService);
      }
      return handleErrorServer(res, 500, errorService);
    }

    return handleSuccess(res, 201, "Reserva creada exitosamente", reserva); 

  } catch (catchError) {
    console.error("catch en createReserva:", catchError);
    return handleErrorServer(res, 500, "Error inesperado en el servidor."); 
  }
};

export const getReservas = async (req, res) => {
  try {
    const [reservas, errorService] = await reservaService.getReservasService();

    if (errorService) {
      if (errorService.includes("encontraron")) {
        return handleErrorClient(res, 404, "Error al obtener reservas", errorService); 
      }
      return handleErrorServer(res, 500, errorService); 
    }

    return handleSuccess(res, 200, "Reservas encontradas", reservas); 

  } catch (catchError) {
    console.error("catch en getReservas:", catchError);
    return handleErrorServer(res, 500, "Error inesperado en el servidor.");
  }
};

export const getReservaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [reserva, errorService] = await reservaService.getReservaByIdService(id);

        if (errorService) {
             if (errorService.includes("encontrada")) {
                return handleErrorClient(res, 404, "Error al obtener reserva", errorService);
             }
             return handleErrorServer(res, 500, errorService); 
        }

        //responde con éxito 
        return handleSuccess(res, 200, "Reserva encontrada", reserva); 

    } catch (catchError) {
        console.error("catch en getReservaById:", catchError);
        return handleErrorServer(res, 500, "Error inesperado en el servidor."); 
    }
};