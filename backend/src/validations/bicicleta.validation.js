"use strict";
import Joi from "joi";

export const buscarBicicletaValidation = Joi.object({
  id: Joi.number().integer().positive(),
  rut: Joi.string().pattern(/^[0-9]{7,8}-[0-9kK]{1}$/),
  cupoId: Joi.number().integer().positive()
}).or("id", "rut", "cupoId").messages({
  "object.missing": "Debe proporcionar id, rut o cupoId para la búsqueda"
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

export const bicycleExitValidation = Joi.object({
  bicicletaId: Joi.number().integer().positive().required(),
  rutEstudiante: Joi.string().pattern(/^[0-9]{7,8}-[0-9kK]{1}$/).required(),
  tipoDocumento: Joi.string().valid("DNI", "TNE", "Pasaporte", "Carnet de Identidad").required(),
  observaciones: Joi.string().max(500).optional()
}).messages({
  "any.only": "El tipo de documento debe ser uno de: DNI, TNE, Pasaporte, Carnet de Identidad"
});