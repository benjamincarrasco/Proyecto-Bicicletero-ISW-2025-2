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

    // Contar bicicletas actualmente en uso (estado: "EnUso")
    const bicicletasEnUso = await bicicletaRepository.count({
        where: { estado: "EnUso" }
    });

    if (configData.totalCupos < bicicletasEnUso) {
        return [null, `No se puede reducir a ${configData.totalCupos} cupos. 
        Hay ${bicicletasEnUso} bicicletas actualmente en uso`];
    }

    config.totalCupos = configData.totalCupos;
    config.cuposOcupados = bicicletasEnUso;
    config.cuposDisponibles = configData.totalCupos - bicicletasEnUso;
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
        cuposOcupados: 0
        });
        await configRepository.save(config);
    }
    
    return [config, null];
    } catch (error) {
    return [null, "Error interno del servidor"];
    }
}
