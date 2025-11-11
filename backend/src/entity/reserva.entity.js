"use strict";
import { EntitySchema } from "typeorm";
import User from "./user.entity.js"; 

const ReservaSchema = new EntitySchema({
  name: "Reserva",
  tableName: "reservas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    // columna para la relación con el usuario
    userId: {
      type: "int",
      nullable: false,
    },
    fecha: {
      type: "date", //usamos date para guardar solo el día
      nullable: false,
    },
    bloqueHorario: {
      type: "varchar",
      length: 50, // Ej: "10:00-11:00"
      nullable: false,
    },
    espacioId: {
      type: "varchar", // un identificador para el bicicletero
      length: 50,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20, //'Pendiente', 'Confirmada', 'Cancelada', 'Usada', 'No-Asistio'
      default: "Pendiente",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  //definimos la relación con la tabla User
  relations: {
    user: {
      type: "many-to-one", // muchas reservas pertenecen a un usuario
      target: "User", //apunta a la entidad User
      joinColumn: {
        name: "userId", 
        referencedColumnName: "id", //la columna en la tabla User
      },
      onDelete: "CASCADE", //si se borra un usuario, se borran sus reservas
    },
  },
  indices: [
    {
      //en la misma fecha y bloque horario.
      name: "IDX_RESERVA_UNICA",
      columns: ["fecha", "bloqueHorario", "espacioId"],
      unique: true,
    },
  ],
});

export default ReservaSchema;