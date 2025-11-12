"use strict";
import Joi from "joi";

//esquema para la creación de una reserva
export const reservaSchema = Joi.object({
  
  fecha: Joi.date().iso().required().messages({ //formato para fecha 
    "date.base": "La fecha debe ser válida.",
    "date.format": "La fecha debe estar en formato ISO (YYYY-MM-DD).",
    "any.required": "La fecha es requerida.",
  }),

  bloqueHorario: Joi.string().min(5).max(50).required().messages({ 
    "string.empty": "El bloque horario no puede estar vacío.",
    "any.required": "El bloque horario es requerido.",
  }),

  espacioId: Joi.string().min(1).max(50).required().messages({ //id del espacio reservado
    "string.empty": "El ID del espacio no puede estar vacío.",
    "any.required": "El ID del espacio es requerido.",
  }),
});