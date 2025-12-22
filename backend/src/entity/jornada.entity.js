"use strict";
import { EntitySchema } from "typeorm";

const JornadaSchema = new EntitySchema({
  name: "Jornada",
  tableName: "Jornadas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      nullable: false,
    },
    bicicletaId: {
      type: "int",
      nullable: false,
    },
    cupoId: {
      type: "int",
      nullable: true,
    },
    rutEstudiante: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    nombreEstudiante: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fechaIngreso: {
      type: "timestamp",
      nullable: false,
    },
    fechaSalida: {
      type: "timestamp",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "Activa",
      nullable: false,
      comment: "Activa | Completada | Cancelada",
    },
    identidadVerificada: {
      type: "boolean",
      default: false,
      nullable: false,
      comment: "Indica si la identidad fue verificada al retiro",
    },
    tipoDocumento: {
      type: "varchar",
      length: 50,
      nullable: true,
      comment: "Tipo de documento usado para verificación: DNI, TNE, Pasaporte, etc.",
    },
    observaciones: {
      type: "text",
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

export default JornadaSchema;
