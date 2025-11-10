"use strict";
import ParkingConfig from "../entity/parkingConfig.entity.js";
import Bicicleta from "../entity/bicicleta.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function updateParkingConfigService(configData) {
    try {
    const configRepository = AppDataSource.getRepository(ParkingConfig);
    const bicicletaRepository = AppDataSource.getRepository(Bicicleta);

    let config = await configRepository.findOne({ where: { id: 1 } });
    if (!config) {
        config = configRepository.create({ id: 1 });
    }

    const bicicletasIngresadas = await bicicletaRepository.count({
        where: { estado: "ingresada" }
    });

    if (configData.totalCupos < bicicletasIngresadas) {
        return [null, `No se puede reducir a ${configData.totalCupos} cupos. 
        Hay ${bicicletasIngresadas} bicicletas ingresadas`];
    }

    config.totalCupos = configData.totalCupos;
    config.cuposDisponibles = configData.totalCupos - bicicletasIngresadas;
    config.cuposOcupados = bicicletasIngresadas;
    config.identificacionCupos = configData.identificacionCupos || false;
    config.descripcion = configData.descripcion;

    await configRepository.save(config);
    return [config, null];
    } catch (error) {
    return [null, "Error interno del servidor"];
    }
}

export async function getParkingConfigService() {
    try {
    const configRepository = AppDataSource.getRepository(ParkingConfig);
    let config = await configRepository.findOne({ where: { id: 1 } });
    
    if (!config) {
        config = configRepository.create({
        id: 1,
        totalCupos: 50,
        cuposDisponibles: 50,
        cuposOcupados: 0,
        identificacionCupos: false
        });
        await configRepository.save(config);
    }
    
    return [config, null];
    } catch (error) {
    return [null, "Error interno del servidor"];
    }
}
