"use strict";
import Bicicleta from "../entity/bicicleta.entity.js";
import Jornada from "../entity/jornada.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtiene bicicletas en estado "Ocupado" que han superado un tiempo máximo permitido
 * @param {number} horasMaximas - Número máximo de horas permitidas
 * @returns {Array} [anomalias, error]
 */
export async function getAnomaliasBicicletasService(horasMaximas) {
  try {
    // Validar input
    if (!horasMaximas || horasMaximas <= 0) {
      return [null, "Debe proporcionar un número positivo de horas"];
    }

    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const jornadaRepository = AppDataSource.getRepository(Jornada);

    // 1. Obtener todas las bicicletas en estado "EnUso"
    const bicyclasEnUso = await bicycleRepository.find({
      where: { estado: "EnUso" },
    });

    if (bicyclasEnUso.length === 0) {
      return [
        {
          anomalias: [],
          mensaje: "No hay bicicletas actualmente en uso",
        },
        null,
      ];
    }

    // 2. Para cada bicicleta en uso, obtener su jornada activa
    const anomalias = [];

    for (const bicicleta of bicyclasEnUso) {
      // Buscar la jornada activa (estado "Activa") de esta bicicleta
      const jornadaActiva = await jornadaRepository.findOne({
        where: {
          bicicletaId: bicicleta.id,
          estado: "Activa",
        },
      });

      if (jornadaActiva) {
        // 3. Calcular el tiempo que lleva ocupada
        const ahora = new Date();
        const ingreso = new Date(jornadaActiva.fechaIngreso);
        const diferenciaMilisegundos = ahora.getTime() - ingreso.getTime();
        const diferenciasHoras = diferenciaMilisegundos / (1000 * 60 * 60);

        // 4. Verificar si supera el límite
        if (diferenciasHoras > horasMaximas) {
          anomalias.push({
            id: bicicleta.id,
            marca: bicicleta.marca,
            modelo: bicicleta.modelo,
            color: bicicleta.color,
            numeroSerie: bicicleta.numeroSerie,
            rutPropietario: bicicleta.rutPropietario,
            nombrePropietario: bicicleta.nombrePropietario,
            emailPropietario: bicicleta.emailPropietario,
            jornadaId: jornadaActiva.id,
            rutEstudiante: jornadaActiva.rutEstudiante,
            nombreEstudiante: jornadaActiva.nombreEstudiante,
            fechaIngreso: jornadaActiva.fechaIngreso,
            horasTranscurridas: Math.round(diferenciasHoras * 100) / 100, // Redondear a 2 decimales
            minutosSobreElLimite: Math.round((diferenciasHoras - horasMaximas) * 60),
            identidadVerificada: jornadaActiva.identidadVerificada,
          });
        }
      }
    }

    // 5. Ordenar por mayor tiempo de ocupación (anomalías más graves primero)
    anomalias.sort((a, b) => b.horasTranscurridas - a.horasTranscurridas);

    const resultado = {
      horasMaximasPermitidas: horasMaximas,
      totalAnomalias: anomalias.length,
      anomalias: anomalias,
    };

    return [resultado, null];
  } catch (error) {
    console.error("Error en getAnomaliasBicicletasService:", error);
    return [null, "Error al obtener anomalías de bicicletas"];
  }
}
