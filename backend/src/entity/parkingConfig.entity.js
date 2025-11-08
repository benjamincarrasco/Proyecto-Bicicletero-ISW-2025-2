"use strict";
import { EntitySchema } from "typeorm";

const ParkingConfigSchema = new EntitySchema({
  name: "ParkingConfig",
  tableName: "parking_config",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    totalCupos: {
      type: "int",
      nullable: false,
    },
    cuposDisponibles: {
      type: "int",
      nullable: false,
    },
    cuposOcupados: {
      type: "int",
      default: 0,
      nullable: false,
    },
    identificacionCupos: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default ParkingConfigSchema;