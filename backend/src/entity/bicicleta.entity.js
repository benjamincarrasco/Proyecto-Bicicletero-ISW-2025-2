"use strict";
import { EntitySchema } from "typeorm";

const BicycleSchema = new EntitySchema({
  name: "Bicicleta",
  tableName: "Bicicletas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      nullable: false,
    },
    marca: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    color: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    numeroSerie: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
    rutPropietario: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    nombrePropietario: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    emailPropietario: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    cupoId: {
      type: "int",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "Disponible",
      nullable: false,
      comment: "Disponible | EnUso | Mantenimiento",
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

export default BicycleSchema;