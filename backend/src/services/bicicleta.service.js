"use strict";
import Bicicleta from "../entity/bicicleta.entity.js";
import ParkingConfig from "../entity/parkingConfig.entity.js";
import Jornada from "../entity/jornada.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function buscarBicicletaService(query) {
  try {
    const { rut, cupoId, id } = query;
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const jornadaRepository = AppDataSource.getRepository(Jornada);

    let whereClause = {}; 
    
    if (id) {
      whereClause.id = parseInt(id);
    } else if (rut) {
      whereClause.rutPropietario = rut;
    } else if (cupoId) {
      whereClause.cupoId = parseInt(cupoId);
    }

    // Buscar todas las bicicletas del propietario/cupo/id (sin filtro de estado)
    const bicycles = await bicycleRepository.find({ where: whereClause });

    if (!bicycles || bicycles.length === 0) {
      return [null, "No se encontraron bicicletas con los criterios especificados"];
    }

    // Obtener historial de jornadas para cada bicicleta
    const bicicletasConHistorial = await Promise.all(
      bicycles.map(async (bici) => {
        const jornadas = await jornadaRepository.find({
          where: { bicicletaId: bici.id },
          order: { fechaIngreso: "DESC" }
        });
        return { ...bici, jornadas };
      })
    );

    return [bicicletasConHistorial, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function registerBicycleService(bicycleData) {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const configRepository = AppDataSource.getRepository(ParkingConfig);
    const jornadaRepository = AppDataSource.getRepository(Jornada);
    const config = await configRepository.findOne({ where: { id: 1 } });
    if (!config || config.cuposDisponibles <= 0) {
      return [null, "No hay cupos disponibles en el bicicletero"];
    }

    // Buscar por numeroSerie: si existe y está "Disponible" reutilizar, si está "EnUso" bloquear
    const existingBicycle = await bicycleRepository.findOne({ where: { numeroSerie: bicycleData.numeroSerie } });

    if (existingBicycle) {
      if (existingBicycle.estado === "EnUso") {
        return [null, "La bicicleta ya se encuentra ingresada en el bicicletero"];
      }

      // Reutilizar registro existente: actualizar datos y marcar en uso
      existingBicycle.marca = bicycleData.marca || existingBicycle.marca;
      existingBicycle.modelo = bicycleData.modelo || existingBicycle.modelo;
      existingBicycle.color = bicycleData.color || existingBicycle.color;
      existingBicycle.rutPropietario = bicycleData.rutPropietario || existingBicycle.rutPropietario;
      existingBicycle.nombrePropietario = bicycleData.nombrePropietario || existingBicycle.nombrePropietario;
      existingBicycle.emailPropietario = bicycleData.emailPropietario || existingBicycle.emailPropietario;
      existingBicycle.cupoId = bicycleData.cupoId || existingBicycle.cupoId || 1;
      existingBicycle.estado = "EnUso";

      const savedBicycle = await bicycleRepository.save(existingBicycle);

      const nuevaJornada = jornadaRepository.create({
        bicicletaId: savedBicycle.id,
        cupoId: savedBicycle.cupoId,
        rutEstudiante: savedBicycle.rutPropietario,
        nombreEstudiante: savedBicycle.nombrePropietario,
        fechaIngreso: new Date(),
        estado: "Activa",
        identidadVerificada: false,
      });

      await jornadaRepository.save(nuevaJornada);

      config.cuposDisponibles = config.cuposDisponibles - 1;
      config.cuposOcupados = config.cuposOcupados + 1;
      await configRepository.save(config);

      return [{ ...savedBicycle, jornadaId: nuevaJornada.id }, null];
    }

    // Si no existe, crear nuevo registro como antes
    const newBicycle = bicycleRepository.create({
      ...bicycleData,
      estado: "EnUso",
      cupoId: bicycleData.cupoId || 1,
    });

    const savedBicycle = await bicycleRepository.save(newBicycle);

    // Registrar entrada en la jornada
    const nuevaJornada = jornadaRepository.create({
      bicicletaId: savedBicycle.id,
      cupoId: savedBicycle.cupoId,
      rutEstudiante: savedBicycle.rutPropietario,
      nombreEstudiante: savedBicycle.nombrePropietario,
      fechaIngreso: new Date(),
      estado: "Activa",
      identidadVerificada: false,
    });

    await jornadaRepository.save(nuevaJornada);

    config.cuposDisponibles = config.cuposDisponibles - 1;
    config.cuposOcupados = config.cuposOcupados + 1;
    await configRepository.save(config);

    return [{ ...savedBicycle, jornadaId: nuevaJornada.id }, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function registerBicycleExitService(exitData) {
  try {
    const { bicicletaId, rutEstudiante, tipoDocumento, observaciones } = exitData;
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const configRepository = AppDataSource.getRepository(ParkingConfig);
    const jornadaRepository = AppDataSource.getRepository(Jornada);

    // Verificar que la bicicleta existe y está en uso
    const bicycle = await bicycleRepository.findOne({
      where: { id: bicicletaId, estado: "EnUso" }
    });

    if (!bicycle) {
      return [null, "Bicicleta no encontrada o no está en uso"];
    }

    // Buscar la jornada activa
    const jornada = await jornadaRepository.findOne({
      where: { bicicletaId, estado: "Activa" }
    });

    if (!jornada) {
      return [null, "No hay una jornada activa para esta bicicleta"];
    }

    // Verificar que el RUT coincide
    if (jornada.rutEstudiante !== rutEstudiante) {
      return [null, "El RUT del estudiante no coincide con el registro de entrada"];
    }

    // Actualizar la jornada con verificación de identidad
    jornada.fechaSalida = new Date();
    jornada.estado = "Retirada";
    jornada.identidadVerificada = true;
    jornada.tipoDocumento = tipoDocumento;
    jornada.observaciones = observaciones;

    await jornadaRepository.save(jornada);

    // Actualizar estado de la bicicleta
    bicycle.estado = "Disponible";
    await bicycleRepository.save(bicycle);

    // Liberar cupo
    const config = await configRepository.findOne({ where: { id: 1 } });
    if (config) {
      config.cuposDisponibles = config.cuposDisponibles + 1;
      config.cuposOcupados = config.cuposOcupados - 1;
      await configRepository.save(config);
    }

    return [{ bicycle, jornada }, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function removeBicycleService(bicycleId) {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const jornadaRepository = AppDataSource.getRepository(Jornada);

    const bicycle = await bicycleRepository.findOne({
      where: { id: bicycleId }
    });

    if (!bicycle) {
      return [null, "Bicicleta no encontrada"];
    }

    // Cancelar jornada activa si existe
    const jornada = await jornadaRepository.findOne({
      where: { bicicletaId: bicycleId, estado: "EnUso" }
    });

    if (jornada) {
      jornada.estado = "Cancelada";
      await jornadaRepository.save(jornada);
    }

    // Cambiar estado de la bicicleta a Retirada
    bicycle.estado = "Retirada";
    await bicycleRepository.save(bicycle);

    return [bicycle, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function getAllBicicletasService() {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const bicycles = await bicycleRepository.find({
      where: { estado: "EnUso" }
    });
    
    if (!bicycles || bicycles.length === 0) {
      return [[], null];
    }

    return [bicycles, null];
  } catch (error) {
    return [null, "Error al obtener las bicicletas"];
  }
}
