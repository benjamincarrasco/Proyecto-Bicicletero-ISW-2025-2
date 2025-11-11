"use strict";
import { AppDataSource } from "../config/configDb.js";
import Reserva from "../entity/reserva.entity.js";

//repositorio de Reservas
const reservaRepository = AppDataSource.getRepository(Reserva);

export async function createReservaService(body) {
  try {
    const { userId, fecha, bloqueHorario, espacioId } = body;

    const reservaExistente = await reservaRepository.findOne({
      where: {
        fecha: new Date(fecha), 
        bloqueHorario: bloqueHorario,
        espacioId: espacioId,
        estado: "Pendiente", 
      },
    });

    if (reservaExistente) {
      return [null, "El espacio ya está reservado en ese horario."];
    }

    const nuevaReserva = reservaRepository.create({
        userId: userId,
        fecha: new Date(fecha),
        bloqueHorario: bloqueHorario,
        espacioId: espacioId,
        estado: "Pendiente" // Estado inicial
    });

    const reservaGuardada = await reservaRepository.save(nuevaReserva);

    return [reservaGuardada, null];
  } catch (error) {
    // Esta línea es la que imprime el error en tu terminal
    console.error("Error al crear la reserva:", error); 
    
    if (error.code === "23505") { //Codigo de postgreSQL 
       return [null, "El espacio ya está reservado en ese horario (Error DB)."];
    }
    return [null, "Error interno del servidor"];
  }
}

export async function getReservasService() {
  try {
    const reservas = await reservaRepository.find({
      relations: ["user"], //carga la info del usuario relacionado
      order: {
        fecha: "DESC",
        bloqueHorario: "ASC",
      },
    });

    if (!reservas || reservas.length === 0) {
      return [null, "No se encontraron reservas"];
    }
    
    const reservasLimpias = reservas.map(reserva => {
        if (reserva.user) {
            const { password, ...userData } = reserva.user;
            reserva.user = userData;
        }
        return reserva;
    });

    return [reservasLimpias, null];
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getReservaByIdService(id) {
  try {
    const reserva = await reservaRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"], //carga la info del usuario
    });

    if (!reserva) {
      return [null, "Reserva no encontrada"];
    }
    
    //ocultar password del usuario
    if (reserva.user) {
        const { password, ...userData } = reserva.user;
        reserva.user = userData;
    }

    return [reserva, null];
  } catch (error) {
    console.error("Error al obtener la reserva:", error);
    return [null, "Error interno del servidor"];
  }
}