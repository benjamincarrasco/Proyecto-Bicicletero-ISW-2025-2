"use strict";
import ParkingConfig from "../entity/parkingConfig.entity.js";
import Bicicleta from "../entity/bicicleta.entity.js";
import Reserva from "../entity/reserva.entity.js";
import Jornada from "../entity/jornada.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtiene los datos para el dashboard del bicicletero
 * Incluye: ocupación actual, cupos disponibles, próximas reservas en 1 hora
 * @returns {Array} [dashboardData, error]
 */
export async function getDashboardDataService() {
  try {
    const parkingRepository = AppDataSource.getRepository(ParkingConfig);
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const reservaRepository = AppDataSource.getRepository(Reserva);

    // 1. Obtener configuración del parking (total de cupos)
    const parkingConfig = await parkingRepository.findOne({ where: { id: 1 } });
    if (!parkingConfig) {
      return [null, "Configuración del parking no encontrada"];
    }

    // 2. Contar bicicletas actualmente en estado "EnUso" (ocupadas)
    const bicycleOccupancy = await bicycleRepository.count({
      where: { estado: "EnUso" },
    });

    // 3. Calcular cupos libres
    const cuposLibres = parkingConfig.totalCupos - bicycleOccupancy;
    const porcentajeOcupacion = Math.round(
      (bicycleOccupancy / parkingConfig.totalCupos) * 100
    );

    // 4. Obtener próximas reservas en los próximos 60 minutos
    const ahora = new Date();
    const proximaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

    // Las reservas están definidas por fecha y bloqueHorario (ej: "10:00-11:00")
    // Para simplificar, obtenemos reservas "Confirmadas" de hoy en adelante
    const proximasReservas = await reservaRepository.find({
      where: {
        estado: "Confirmada",
        // Aquí podrías agregar más lógica si necesitas filtrar por bloque horario
        // Por ahora, obtener todas las confirmadas
      },
      relations: ["user"],
    });

    // Filtrar manualmente reservas que caen en los próximos 60 minutos
    // (dependiendo de cómo definan el bloqueHorario)
    const proximasEnLaHora = proximasReservas.filter((reserva) => {
      // Aquí depende de cómo manejen los bloques horarios
      // Por ahora, retornar todas las confirmadas (puedes ajustar después)
      return true;
    });

    // 5. Construir respuesta
    const dashboardData = {
      ocupacion: {
        totalCupos: parkingConfig.totalCupos,
        cuposOcupados: bicycleOccupancy,
        cuposLibres: cuposLibres,
        porcentajeOcupacion: porcentajeOcupacion,
      },
      proximasReservas: {
        cantidad: proximasEnLaHora.length,
        reservas: proximasEnLaHora.map((r) => ({
          id: r.id,
          usuario: r.user?.nombreCompleto || "No identificado",
          fecha: r.fecha,
          bloqueHorario: r.bloqueHorario,
          email: r.user?.email,
        })),
      },
    };

    return [dashboardData, null];
  } catch (error) {
    console.error("Error en getDashboardDataService:", error);
    return [null, "Error al obtener datos del dashboard"];
  }
}
