"use strict";
import Bicicleta from "../entity/bicicleta.entity.js";
import ParkingConfig from "../entity/parkingConfig.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function buscarBicicletaService(query) {
  try {
    const { rut, cupoId } = query;
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);

    let whereClause = { estado: "ingresada" };
    
    if (rut) {
      whereClause.rutPropietario = rut;
    } else if (cupoId) {
      whereClause.cupoId = parseInt(cupoId);
    }

    const bicicleta = await bicycleRepository.find({ where: whereClause });

    if (!bicicleta || bicicleta.length === 0) {
      return [null, "No se encontraron bicicletas con los criterios especificados"];
    }

    return [bicicleta, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function registerBicycleService(bicycleData) {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const configRepository = AppDataSource.getRepository(ParkingConfig);

    const config = await configRepository.findOne({ where: { id: 1 } });
    if (!config || config.cuposDisponibles <= 0) {
      return [null, "No hay cupos disponibles en el bicicletero"];
    }

    const newBicycle = bicycleRepository.create({
      ...bicycleData,
      estado: "ingresada"
    });

    await bicycleRepository.save(newBicycle);

    config.cuposDisponibles = config.cuposDisponibles - 1;
    config.cuposOcupados = config.cuposOcupados + 1;
    await configRepository.save(config);

    return [newBicycle, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

export async function removeBicycleService(bicycleId) {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicicleta);
    const configRepository = AppDataSource.getRepository(ParkingConfig);

    const bicycle = await bicycleRepository.findOne({
      where: { id: bicycleId, estado: "ingresada" }
    });

    if (!bicycle) {
      return [null, "Bicicleta no encontrada o ya fue retirada"];
    }

    bicycle.estado = "retirada";
    await bicycleRepository.save(bicycle);

    const config = await configRepository.findOne({ where: { id: 1 } });
    if (config) {
      config.cuposDisponibles = config.cuposDisponibles + 1;
      config.cuposOcupados = config.cuposOcupados - 1;
      await configRepository.save(config);
    }

    return [bicycle, null];
  } catch (error) {
    return [null, "Error interno del servidor"];
  }
}

