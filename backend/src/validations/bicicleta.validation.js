"use strict";
import Joi from "joi";

export const buscarBicicletaValidation = Joi.object({
  rut: Joi.string().pattern(/^[0-9]{7,8}-[0-9kK]{1}$/),
  cupoId: Joi.number().integer().positive()
}).or("rut", "cupoId").messages({
  "object.missing": "Debe proporcionar rut o cupoId para la búsqueda"
});

export const bicycleRegisterValidation = Joi.object({
  marca: Joi.string().min(2).max(100).required(),
  modelo: Joi.string().min(1).max(100).required(),
  color: Joi.string().min(3).max(50).required(),
  numeroSerie: Joi.string().min(5).max(100).required(),
  rutPropietario: Joi.string().pattern(/^[0-9]{7,8}-[0-9kK]{1}$/).required(),
  nombrePropietario: Joi.string().min(5).max(255).required(),
  emailPropietario: Joi.string().email().required(),
  cupoId: Joi.number().integer().positive().optional()
});