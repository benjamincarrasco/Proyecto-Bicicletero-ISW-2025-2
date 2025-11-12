"use strict";
import Joi from "joi";

export const parkingConfigValidation = Joi.object({
    totalCupos: Joi.number().integer().positive().required().messages({
    "number.base": "El total de cupos debe ser un número",
    "number.integer": "El total de cupos debe ser un número entero", 
    "number.positive": "El total de cupos debe ser positivo",
    "any.required": "El total de cupos es requerido"
    }),
    descripcion: Joi.string().max(500).allow("", null)
});