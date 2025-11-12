"use strict";
import User from "../entity/user.entity.js";
import ParkingConfig from "../entity/parkingConfig.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    await userRepository.save([
      {
        nombreCompleto: "Administrador Principal",
        rut: "12.345.678-9",
        email: "admin@bicicletero.cl",
        password: await encryptPassword("admin123"),
        rol: "administrador",
      },
      {
        nombreCompleto: "Guardia Principal",
        rut: "98.765.432-1",
        email: "guardia@bicicletero.cl",
        password: await encryptPassword("guardia123"),
        rol: "guardia",
      }
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createParkingConfig() {
  try {
    const configRepository = AppDataSource.getRepository(ParkingConfig);
    const count = await configRepository.count();
    if (count > 0) return;

    await configRepository.save({
      id: 1,
      totalCupos: 50,
      cuposDisponibles: 50,
      cuposOcupados: 0,
      descripcion: "Configuración inicial del bicicletero",
    });
    console.log("* => Configuración del bicicletero creada exitosamente");
  } catch (error) {
    console.error("Error al crear configuración:", error);
  }
}

export { createUsers, createParkingConfig };