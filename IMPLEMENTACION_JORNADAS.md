# 📋 Implementación Requisito Funcional - Jornada Completa de Bicicletas

## ✅ Cambios Realizados

### 1. **Nueva Entidad: `jornada.entity.js`**
- Registra el ciclo completo de entrada y salida de bicicletas
- Campos principales:
  - `bicicletaId`: Referencia a la bicicleta
  - `rutEstudiante`: RUT del estudiante propietario
  - `nombreEstudiante`: Nombre del estudiante
  - `fechaIngreso`: Timestamp de entrada
  - `fechaSalida`: Timestamp de salida (null hasta que se complete)
  - `estado`: "Activa" → "Completada" o "Cancelada"
  - `identidadVerificada`: Boolean - indica si la identidad fue verificada
  - `tipoDocumento`: Tipo de documento usado (DNI, TNE, Pasaporte, etc.)

### 2. **Actualización: `bicicleta.entity.js`**
- **Estados actualizados:**
  - `"Disponible"`: Lista para usar
  - `"EnUso"`: Con estudiante
  - `"Mantenimiento"`: Fuera de servicio

### 3. **Nueva Función en Service: `registerBicycleExitService()`**
**Lógica de Salida:**
```
1. Verifica que la bicicleta existe y está "EnUso"
2. Busca la jornada activa
3. Valida que el RUT del estudiante coincide (REQUISITO: Verificación de identidad)
4. Registra:
   - Fecha/hora de salida
   - Tipo de documento usado
   - Marca identidad como verificada
   - Cambia estado jornada a "Completada"
5. Libera cupo en tiempo real
6. Cambia bicicleta a "Disponible"
```

### 4. **Actualización: Controller y Routes**
- Nueva función: `registrarSalidaBicicleta()`
- Nueva ruta: `POST /api/bicis/salida`

### 5. **Nueva Validación: `bicycleExitValidation`**
```javascript
{
  bicicletaId: número (requerido),
  rutEstudiante: string RUT (requerido),
  tipoDocumento: "DNI" | "TNE" | "Pasaporte" | "Carnet de Identidad" (requerido),
  observaciones: string (opcional)
}
```

---

## 🔄 Flujo Completo de Jornada

### **ENTRADA (POST /api/bicis/register)**
```
Guardia ingresa:
├─ marca, modelo, color
├─ numeroSerie
├─ rutPropietario (del estudiante)
├─ nombrePropietario
├─ emailPropietario
└─ cupoId (opcional)

Sistema:
├─ ✓ Verifica cupo disponible
├─ ✓ Crea registro Bicicleta (estado: "EnUso")
├─ ✓ Crea Jornada (estado: "Activa")
├─ ✓ Asigna cupo (marca como ocupado)
├─ ✓ Registra fechaIngreso (CURRENT_TIMESTAMP)
└─ ✓ Responde con ID jornada
```

### **SALIDA (POST /api/bicis/salida)**
```
Guardia ingresa:
├─ bicicletaId
├─ rutEstudiante (solicita documento al estudiante)
├─ tipoDocumento (lo que presenta: DNI, TNE, etc.)
└─ observaciones (opcional)

Sistema:
├─ ✓ Verifica bicicleta en uso
├─ ✓ Busca jornada activa
├─ ✓ Valida coincidencia RUT (VERIFICACIÓN IDENTIDAD)
├─ ✓ Marca identidadVerificada = true
├─ ✓ Registra tipoDocumento usado
├─ ✓ Registra fechaSalida (CURRENT_TIMESTAMP)
├─ ✓ Cambia estado jornada a "Completada"
├─ ✓ Libera cupo (estado: "Disponible")
├─ ✓ Actualiza cuposDisponibles (+1) en tiempo real
└─ ✓ Responde con datos completos de jornada
```

---

## 📡 Endpoints del Bicicletero

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/bicis/register` | Registrar entrada | `{marca, modelo, color, numeroSerie, rutPropietario, nombrePropietario, emailPropietario, cupoId?}` |
| POST | `/api/bicis/salida` | Registrar salida verificada | `{bicicletaId, rutEstudiante, tipoDocumento, observaciones?}` |
| GET | `/api/bicis/buscar` | Buscar bicicletas | `?rut=...` o `?cupoId=...` o `?estado=...` |
| GET | `/api/bicis/datos` | Estadísticas | - |
| PATCH | `/api/bicis/remove/:id` | Sacar de servicio | - |

---

## 🔐 Seguridad

✓ **Verificación de identidad:** Se solicita documento oficial y se valida coincidencia de RUT
✓ **Autenticación:** Todos los endpoints requieren JWT (authenticateJwt)
✓ **Autorización:** Solo Guardias pueden acceder (isGuardia)
✓ **Validación de datos:** Joi schemas para entrada y salida

---

## 📊 Estados de la Jornada

```
Activa ──► Completada (con salida y identidad verificada)
      └──► Cancelada (si se retira la bicicleta del servicio)
```

---

## 🚀 Próximos Pasos

1. **Base de datos:** El `synchronize: true` creará la tabla automáticamente
2. **Pruebas:** Usar endpoints en orden:
   - POST /register → obtener bicicletaId
   - POST /salida → completar jornada
3. **Frontend:** Implementar formulario de salida con:
   - Campo RUT (solicitar a estudiante)
   - Selector tipo documento
   - Botón verificar/confirmar salida

---

## 📝 Ejemplo de Respuesta Jornada Completada

```json
{
  "status": 200,
  "message": "Salida registrada exitosamente. Jornada completada.",
  "data": {
    "bicycle": {
      "id": 1,
      "marca": "Trek",
      "estado": "Disponible",
      ...
    },
    "jornada": {
      "id": 5,
      "bicicletaId": 1,
      "rutEstudiante": "20123456-7",
      "nombreEstudiante": "Juan Pérez",
      "fechaIngreso": "2025-11-11T10:30:00.000Z",
      "fechaSalida": "2025-11-11T12:45:00.000Z",
      "estado": "Completada",
      "identidadVerificada": true,
      "tipoDocumento": "Carnet de Identidad"
    }
  }
}
```

✅ **Implementación completa del requisito funcional**
