"use strict";
import Jornada from "../entity/jornada.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtiene jornadas completadas en un rango de fechas para análisis de tendencias
 * @param {Date} fechaInicio - Fecha de inicio del rango
 * @param {Date} fechaFin - Fecha de fin del rango
 * @returns {Array} [jornadas, error]
 */
export async function getJornadasPorRangoService(fechaInicio, fechaFin) {
  try {
    const jornadaRepository = AppDataSource.getRepository(Jornada);

    // Obtener todas las jornadas completadas en el rango de fechas
    const jornadas = await jornadaRepository
      .createQueryBuilder("jornada")
      .where("jornada.estado = :estado", { estado: "Completada" })
      .andWhere("jornada.fechaIngreso >= :fechaInicio", { fechaInicio })
      .andWhere("jornada.fechaIngreso <= :fechaFin", { fechaFin })
      .orderBy("jornada.fechaIngreso", "ASC")
      .getMany();

    return [jornadas, null];
  } catch (error) {
    console.error("Error en getJornadasPorRangoService:", error);
    return [null, "Error al obtener jornadas del rango especificado"];
  }
}

/**
 * Calcula estadísticas de horas pico (para gráfico de barras)
 * @param {Array} jornadas - Array de jornadas completadas
 * @returns {Object} Objeto con horas como claves y cantidad de usos como valores
 */
export function calcularHorasPico(jornadas) {
  const horasPico = {};

  // Inicializar todas las horas del día (0-23)
  for (let hora = 0; hora < 24; hora++) {
    horasPico[hora] = 0;
  }

  // Contar usos por hora de ingreso
  jornadas.forEach((jornada) => {
    const hora = new Date(jornada.fechaIngreso).getHours();
    horasPico[hora]++;
  });

  return horasPico;
}

/**
 * Calcula total de bicicletas guardadas por día (para gráfico de línea)
 * @param {Array} jornadas - Array de jornadas completadas
 * @returns {Object} Objeto con fechas como claves y cantidad de usos como valores
 */
export function calcularTotalPorDia(jornadas) {
  const totalPorDia = {};

  jornadas.forEach((jornada) => {
    // Obtener la fecha sin la hora
    const fecha = new Date(jornada.fechaIngreso).toISOString().split("T")[0];

    if (!totalPorDia[fecha]) {
      totalPorDia[fecha] = 0;
    }
    totalPorDia[fecha]++;
  });

  return totalPorDia;
}

/**
 * Calcula el tiempo de ocupación en minutos para cada jornada
 * @param {Object} jornada - Jornada completada
 * @returns {number} Tiempo en minutos
 */
export function calcularTiempoOcupacion(jornada) {
  if (!jornada.fechaSalida) return 0;

  const ingreso = new Date(jornada.fechaIngreso).getTime();
  const salida = new Date(jornada.fechaSalida).getTime();

  return Math.round((salida - ingreso) / (1000 * 60)); // Convertir a minutos
}

/**
 * Genera datos para el reporte de tendencias
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Array} [reportData, error]
 */
export async function getReporteTendenciasService(fechaInicio, fechaFin) {
  try {
    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return [null, "Debe proporcionar fechaInicio y fechaFin"];
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio > fin) {
      return [null, "La fecha de inicio no puede ser mayor que la fecha de fin"];
    }

    // Obtener jornadas del rango
    const [jornadas, errorJornadas] = await getJornadasPorRangoService(inicio, fin);
    if (errorJornadas) {
      return [null, errorJornadas];
    }

    // Calcular estadísticas
    const horasPico = calcularHorasPico(jornadas);
    const totalPorDia = calcularTotalPorDia(jornadas);

    // Preparar datos para exportar a CSV (datos brutos)
    const datosParaCSV = jornadas.map((jornada) => ({
      id_jornada: jornada.id,
      id_estudiante: jornada.rutEstudiante, // Usamos RUT como ID
      nombre_estudiante: jornada.nombreEstudiante,
      fecha_ingreso: jornada.fechaIngreso,
      fecha_salida: jornada.fechaSalida,
      tiempo_ocupacion_minutos: calcularTiempoOcupacion(jornada),
    }));

    // Calcular estadísticas generales
    const tiemposOcupacion = datosParaCSV.map((d) => d.tiempo_ocupacion_minutos);
    const tiempoPromedio =
      tiemposOcupacion.length > 0
        ? Math.round(tiemposOcupacion.reduce((a, b) => a + b, 0) / tiemposOcupacion.length)
        : 0;
    const tiempoMax = tiemposOcupacion.length > 0 ? Math.max(...tiemposOcupacion) : 0;
    const tiempoMin = tiemposOcupacion.length > 0 ? Math.min(...tiemposOcupacion) : 0;

    const reporteData = {
      periodo: {
        fechaInicio: inicio.toISOString().split("T")[0],
        fechaFin: fin.toISOString().split("T")[0],
      },
      estadisticas: {
        totalUsos: jornadas.length,
        tiempoPromedioMinutos: tiempoPromedio,
        tiempoMaximoMinutos: tiempoMax,
        tiempoMinimoMinutos: tiempoMin,
      },
      horasPico: horasPico,
      totalPorDia: totalPorDia,
      datosParaCSV: datosParaCSV,
    };

    return [reporteData, null];
  } catch (error) {
    console.error("Error en getReporteTendenciasService:", error);
    return [null, "Error al generar reporte de tendencias"];
  }
}

/**
 * Genera un CSV a partir de los datos brutos
 * @param {Array} datosParaCSV - Array de objetos con datos de jornadas
 * @returns {string} CSV formateado
 */
export function generarCSV(datosParaCSV) {
  if (!datosParaCSV || datosParaCSV.length === 0) {
    return "ID_Jornada,ID_Estudiante,Nombre_Estudiante,Fecha_Ingreso,Fecha_Salida,Tiempo_Ocupacion_Minutos\n";
  }

  // Encabezado
  const encabezado =
    "ID_Jornada,ID_Estudiante,Nombre_Estudiante,Fecha_Ingreso,Fecha_Salida,Tiempo_Ocupacion_Minutos\n";

  // Filas
  const filas = datosParaCSV
    .map(
      (dato) =>
        `${dato.id_jornada},"${dato.id_estudiante}","${dato.nombre_estudiante}","${new Date(dato.fecha_ingreso).toISOString()}","${new Date(dato.fecha_salida).toISOString()}",${dato.tiempo_ocupacion_minutos}`
    )
    .join("\n");

  return encabezado + filas;
}
